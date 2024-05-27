import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Courier,
  CourierProps,
} from "@/domain/delivery-management/enterprise/entities/courier";
import { PrismaCourierMapper } from "@/infra/database/prisma/mappers/prisma-courier-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeCourier(
  override: Partial<CourierProps> = {},
  id?: UniqueEntityID,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      pin: faker.string.numeric(11),
      password: faker.internet.password(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return courier;
}

@Injectable()
export class CourierFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data);

    await this.prisma.user.create({
      data: PrismaCourierMapper.toPrisma(courier),
    });

    return courier;
  }
}
