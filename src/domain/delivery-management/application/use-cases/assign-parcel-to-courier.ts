import { Either, left, right } from "@/core/either";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Parcel, ParcelStatus } from "../../enterprise/entities/parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface AssignParcelToCourierUseCaseRequest {
  parcelId: string;
  courierId: string;
}

type AssignParcelToCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>;

export class AssignParcelToCourierUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    parcelId,
    courierId,
  }: AssignParcelToCourierUseCaseRequest): Promise<AssignParcelToCourierUseCaseResponse> {
    const parcel = await this.parcelsRepository.findById(parcelId);

    if (!parcel) {
      return left(new ResourceNotFoundError());
    }

    if (parcel.assignedCourierId) {
      return left(new NotAllowedError());
    }

    parcel.assignedCourierId = new UniqueEntityID(courierId);
    parcel.status = ParcelStatus.InTransit;

    await this.parcelsRepository.save(parcel);

    return right({ parcel });
  }
}
// TODO: Watched list?
