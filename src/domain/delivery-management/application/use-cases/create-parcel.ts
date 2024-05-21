import { Either, right } from "@/core/either";
import { Parcel, ParcelStatus } from "../../enterprise/entities/parcel";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateParcelUseCaseRequest {
  recipientId: string;
}

type CreateParcelUseCaseResponse = Either<null, { parcel: Parcel }>;

export class CreateParcelUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    recipientId,
  }: CreateParcelUseCaseRequest): Promise<CreateParcelUseCaseResponse> {
    const parcel = Parcel.create({
      recipientId: new UniqueEntityID(recipientId),
      assignedCourierId: null,
      status: ParcelStatus.AwaitingPickup,
      createdAt: new Date(),
    });

    await this.parcelsRepository.create(parcel);

    return right({
      parcel,
    });
  }
}
