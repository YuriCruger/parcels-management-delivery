import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { CreateRecipientUseCase } from "./create-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: CreateRecipientUseCase;

describe("Create Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository);
  });

  it("should be able to create a recipient", async () => {
    const result = await sut.execute({
      name: "John Doe",
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.recipient.id).toEqual(expect.any(UniqueEntityID));
    expect(result.value?.recipient.name).toEqual("John Doe");
  });
});
