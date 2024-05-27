import { Either, left, right } from "@/core/either";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Parcel, ParcelStatus } from "../../enterprise/entities/parcel";
import { Injectable } from "@nestjs/common";

interface ReturnParcelUseCaseRequest {
  parcelId: string;
}

type ReturnParcelUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>;

@Injectable()
export class ReturnParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
  }: ReturnParcelUseCaseRequest): Promise<ReturnParcelUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId);

    if (!parcel) {
      return left(new ResourceNotFoundError());
    }

    parcel.status = ParcelStatus.RETURNED;

    await this.parcelsRepository.save(parcel);

    return right({ parcel });
  }
}
