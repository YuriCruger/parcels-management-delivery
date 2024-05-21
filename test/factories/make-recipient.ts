import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Recipient,
  RecipientProps,
} from "@/domain/delivery-management/enterprise/entities/recipient";

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: "John Doe",
      latitude: -31.6991463,
      longitude: -52.3698176,
      ...override,
    },
    id,
  );
  return recipient;
}
