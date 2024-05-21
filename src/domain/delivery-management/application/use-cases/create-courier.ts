import { Either, right } from "@/core/either";
import { Courier } from "../../enterprise/entities/courier";
import { CouriersRepository } from "../repositories/couriers-repository";

interface CreateCourierUseCaseRequest {
  name: string;
  pin: string;
  latitude: string;
  longitude: string;
}

type CreateCourierUseCaseResponse = Either<null, { courier: Courier }>;

export class CreateCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    name,
    pin,
    latitude,
    longitude,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    const courier = Courier.create({ name, pin, latitude, longitude });

    await this.couriersRepository.create(courier);

    return right({
      courier,
    });
  }
}
