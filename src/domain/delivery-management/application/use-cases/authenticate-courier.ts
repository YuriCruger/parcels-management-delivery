import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/couriers-repository";
import { Injectable } from "@nestjs/common";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";

interface AuthenticateCourierUseCaseRequest {
  pin: string;
  password: string;
}

type AuthenticateCourierUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    pin,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByPin(pin);

    if (!courier) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      courier.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
