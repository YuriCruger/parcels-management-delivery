import { Either, left, right } from "@/core/either";
import { Courier } from "../../enterprise/entities/courier";
import { CouriersRepository } from "../repositories/couriers-repository";
import { CourierAlreadyExistsError } from "./errors/courier-already-exists-error";
import { HashGenerator } from "../cryptography/hash-generator";
import { Injectable } from "@nestjs/common";

interface CreateCourierUseCaseRequest {
  name: string;
  pin: string;
  password: string;
  latitude: number;
  longitude: number;
}

type CreateCourierUseCaseResponse = Either<
  CourierAlreadyExistsError,
  { courier: Courier }
>;

@Injectable()
export class CreateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    pin,
    password,
    latitude,
    longitude,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    const courierWithSamePin = await this.couriersRepository.findByPin(pin);

    if (courierWithSamePin) {
      return left(new CourierAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const courier = Courier.create({
      name,
      pin,
      password: hashedPassword,
      latitude,
      longitude,
    });

    await this.couriersRepository.create(courier);

    return right({
      courier,
    });
  }
}
