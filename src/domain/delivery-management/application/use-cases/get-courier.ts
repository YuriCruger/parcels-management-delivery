import { Either, left, right } from "@/core/either";
import { CouriersRepository } from "../repositories/couriers-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Courier } from "../../enterprise/entities/courier";
import { Injectable } from "@nestjs/common";

interface GetCourierUseCaseRequest {
  courierId: string;
}

type GetCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  { courier: Courier }
>;

@Injectable()
export class GetCourierUseCase {
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
  }: GetCourierUseCaseRequest): Promise<GetCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId);

    if (!courier) {
      return left(new ResourceNotFoundError());
    }

    return right({ courier });
  }
}
