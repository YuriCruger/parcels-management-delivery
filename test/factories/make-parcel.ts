import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Parcel,
  ParcelProps,
  ParcelStatus,
} from "@/domain/delivery-management/enterprise/entities/parcel";

export function makeParcel(
  override: Partial<ParcelProps> = {},
  id?: UniqueEntityID,
) {
  const parcel = Parcel.create(
    {
      recipientId: new UniqueEntityID(),
      assignedCourierId: null,
      status: ParcelStatus.AwaitingPickup,
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return parcel;
}
