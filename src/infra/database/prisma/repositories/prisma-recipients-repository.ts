import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import {
  FindManyNearbyParams,
  RecipientsRepository,
} from "@/domain/delivery-management/application/repositories/recipients-repository";
import { Recipient } from "@/domain/delivery-management/enterprise/entities/recipient";
import { PrismaRecipientMapper } from "../mappers/prisma-recipient-mapper";
import { getDistanceBetweenCoordinates } from "test/utils/get-distance-between-coordinates";

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findManyNearBy({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany();

    const nearbyRecipients = recipients.filter((recipient) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: parseFloat(recipient.latitude),
          longitude: parseFloat(recipient.longitude),
        },
      );

      return distance < 10;
    });

    return nearbyRecipients.map(PrismaRecipientMapper.toDomain);
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({ data });
  }
}
