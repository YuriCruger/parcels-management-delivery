import { Recipient } from "../../enterprise/entities/recipient";

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface RecipientRepository {
  findById(id: string): Promise<Recipient | null>;
  findManyNearBy(params: FindManyNearbyParams): Promise<Recipient[]>;
  create(recipient: Recipient): Promise<void>;
}
