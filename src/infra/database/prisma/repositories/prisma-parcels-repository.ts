import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { Parcel } from "@/domain/delivery-management/enterprise/entities/parcel";
import { PrismaParcelMapper } from "../mappers/prisma-parcel-mapper";
import { ParcelsRepository } from "@/domain/delivery-management/application/repositories/parcels-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaParcelsRepository implements ParcelsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Parcel> {
    const parcel = await this.prisma.parcel.findUnique({
      where: {
        id,
      },
    });

    if (!parcel) {
      return null;
    }

    return PrismaParcelMapper.toDomain(parcel);
  }

  async findManyByCourierId(
    courierId: string,
    { page }: PaginationParams,
  ): Promise<Parcel[]> {
    const courierParcels = await this.prisma.parcel.findMany({
      where: {
        userId: courierId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return courierParcels.map(PrismaParcelMapper.toDomain);
  }

  async create(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel);

    await this.prisma.parcel.create({ data });

    DomainEvents.dispatchEventsForAggregate(parcel.id);
  }

  async save(parcel: Parcel) {
    const data = PrismaParcelMapper.toPrisma(parcel);

    await this.prisma.parcel.update({
      where: {
        id: parcel.id.toString(),
      },
      data,
    });

    DomainEvents.dispatchEventsForAggregate(parcel.id);
  }

  async delete(parcel: Parcel): Promise<void> {
    const data = PrismaParcelMapper.toPrisma(parcel);

    await this.prisma.parcel.delete({
      where: {
        id: data.id,
      },
    });
  }
}
