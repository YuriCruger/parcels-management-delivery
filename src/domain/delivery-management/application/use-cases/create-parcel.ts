import { Either, right } from "@/core/either";
import { Parcel, ParcelStatus } from "../../enterprise/entities/parcel";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface CreateParcelUseCaseRequest {
  recipientId: string;
}

type CreateParcelUseCaseResponse = Either<null, { parcel: Parcel }>;

@Injectable()
export class CreateParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    recipientId,
  }: CreateParcelUseCaseRequest): Promise<CreateParcelUseCaseResponse> {
    const parcel = Parcel.create({
      recipientId: new UniqueEntityID(recipientId),
      status: ParcelStatus.AWAITING_PICKUP,
    });

    await this.parcelsRepository.create(parcel);

    return right({
      parcel,
    });
  }
}
