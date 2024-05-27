import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/couriers-repository";
import { Injectable } from "@nestjs/common";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Courier } from "../../enterprise/entities/courier";
import { HashGenerator } from "../cryptography/hash-generator";
import { HashComparer } from "../cryptography/hash-comparer";

interface ChangeCourierPasswordUseCaseRequest {
  courierId: string;
  oldPassword: string;
  newPassword: string;
}

type ChangeCourierPasswordUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  { courier: Courier }
>;

@Injectable()
export class ChangeCourierPasswordUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    courierId,
    oldPassword,
    newPassword,
  }: ChangeCourierPasswordUseCaseRequest): Promise<ChangeCourierPasswordUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      oldPassword,
      courier.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    courier.password = await this.hashGenerator.hash(newPassword);

    await this.couriersRepository.save(courier);

    return right({
      courier,
    });
  }
}
