import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/domain/delivery-management/enterprise/entities/recipient";
import { Prisma, Recipient as PrismaRecipient } from "@prisma/client";

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        latitude: parseFloat(raw.latitude),
        longitude: parseFloat(raw.longitude),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      latitude: recipient.latitude.toString(),
      longitude: recipient.longitude.toString(),
    };
  }
}
