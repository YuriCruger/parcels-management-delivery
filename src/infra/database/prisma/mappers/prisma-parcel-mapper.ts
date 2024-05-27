import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Parcel,
  ParcelStatus as DomainParcelStatus,
} from "@/domain/delivery-management/enterprise/entities/parcel";
import {
  ParcelStatus as PrismaParcelStatus,
  Prisma,
  Parcel as PrismaParcel,
} from "@prisma/client";

function mapPrismaStatusToDomainStatus(
  status: PrismaParcelStatus,
): DomainParcelStatus {
  switch (status) {
    case PrismaParcelStatus.AWAITING_PICKUP:
      return DomainParcelStatus.AWAITING_PICKUP;
    case PrismaParcelStatus.IN_TRANSIT:
      return DomainParcelStatus.IN_TRANSIT;
    case PrismaParcelStatus.DELIVERED:
      return DomainParcelStatus.DELIVERED;
    case PrismaParcelStatus.RETURNED:
      return DomainParcelStatus.RETURNED;
    default:
      throw new Error(`Unknown ParcelStatus: ${status}`);
  }
}

export class PrismaParcelMapper {
  static toDomain(raw: PrismaParcel): Parcel {
    return Parcel.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        status: mapPrismaStatusToDomainStatus(raw.status),
        url: raw.photoUrl,
        assignedCourierId: raw.userId ? new UniqueEntityID(raw.userId) : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(parcel: Parcel): Prisma.ParcelUncheckedCreateInput {
    return {
      id: parcel.id.toString(),
      recipientId: parcel.recipientId.toString(),
      photoUrl: parcel.url,
      status: parcel.status,
      userId: parcel.assignedCourierId && parcel.assignedCourierId.toString(),
    };
  }
}
