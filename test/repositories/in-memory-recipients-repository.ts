import {
  FindManyNearbyParams,
  RecipientsRepository,
} from "@/domain/delivery-management/application/repositories/recipients-repository";
import { Recipient } from "@/domain/delivery-management/enterprise/entities/recipient";
import { getDistanceBetweenCoordinates } from "test/utils/get-distance-between-coordinates";

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = [];

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id);

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async findManyNearBy(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      );

      return distance < 10;
    });
  }

  async create(recipient: Recipient) {
    this.items.push(recipient);
  }
}
