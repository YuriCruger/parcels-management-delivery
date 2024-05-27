import { CouriersRepository } from "@/domain/delivery-management/application/repositories/couriers-repository";
import { PrismaService } from "../prisma.service";
import { Courier } from "@/domain/delivery-management/enterprise/entities/courier";
import { Injectable } from "@nestjs/common";
import { PrismaCourierMapper } from "../mappers/prisma-courier-mapper";

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Courier> {
    const courier = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!courier) {
      return null;
    }

    return PrismaCourierMapper.toDomain(courier);
  }

  async findByPin(pin: string): Promise<Courier> {
    const courier = await this.prisma.user.findUnique({
      where: {
        pin,
      },
    });

    if (!courier) {
      return null;
    }

    return PrismaCourierMapper.toDomain(courier);
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prisma.user.create({ data });
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prisma.user.update({
      where: {
        id: courier.id.toString(),
      },
      data,
    });
  }

  async delete(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier);

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
}
