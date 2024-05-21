import { Either, right } from "@/core/either";
import { RecipientRepository } from "../repositories/recipient-repository";
import { Recipient } from "../../enterprise/entities/recipient";

interface CreateRecipientUseCaseRequest {
  name: string;
  latitude: number;
  longitude: number;
}

type CreateRecipientUseCaseResponse = Either<null, { recipient: Recipient }>;

export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({ name, latitude, longitude });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
