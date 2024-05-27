import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Parcel,
  ParcelProps,
  ParcelStatus,
} from "@/domain/delivery-management/enterprise/entities/parcel";
import { PrismaParcelMapper } from "@/infra/database/prisma/mappers/prisma-parcel-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeParcel(
  override: Partial<ParcelProps> = {},
  id?: UniqueEntityID,
) {
  const parcel = Parcel.create(
    {
      recipientId: new UniqueEntityID(),
      assignedCourierId: null,
      status: ParcelStatus.AWAITING_PICKUP,
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return parcel;
}

@Injectable()
export class ParcelFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaParcel(data: Partial<ParcelProps> = {}): Promise<Parcel> {
    const parcel = makeParcel(data);

    await this.prisma.parcel.create({
      data: PrismaParcelMapper.toPrisma(parcel),
    });

    return parcel;
  }
}
