import { Recipient } from "../../enterprise/entities/recipient";

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<Recipient | null>;
  abstract findManyNearBy(params: FindManyNearbyParams): Promise<Recipient[]>;
  abstract create(recipient: Recipient): Promise<void>;
}
