import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Courier } from "@/domain/delivery-management/enterprise/entities/courier";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    return Courier.create(
      {
        name: raw.name,
        pin: raw.pin,
        password: raw.password,
        latitude: parseFloat(raw.latitude),
        longitude: parseFloat(raw.longitude),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      pin: courier.pin,
      password: courier.password,
      latitude: courier.latitude.toString(),
      longitude: courier.longitude.toString(),
    };
  }
}
