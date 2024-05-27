import { Either, left, right } from "@/core/either";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteParcelUseCaseRequest {
  parcelId: string;
}

type DeleteParcelUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: DeleteParcelUseCaseRequest): Promise<DeleteParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId);

    if (!parcel) {
      return left(new ResourceNotFoundError());
    }

    await this.parcelsRepository.delete(parcel);

    return right(null);
  }
}
