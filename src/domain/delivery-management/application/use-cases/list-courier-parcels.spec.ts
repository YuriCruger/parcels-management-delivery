import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { makeParcel } from "test/factories/make-parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { makeRecipient } from "test/factories/make-recipient";
import { ListCourierParcelsUseCase } from "./list-courier-parcels";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: ListCourierParcelsUseCase;

describe("Fetch Courier Parcels", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new ListCourierParcelsUseCase(inMemoryParcelsRepository);
  });

  it("should be able to fetch a courier parcels", async () => {
    const recipient = makeRecipient({}, new UniqueEntityID("recipient-1"));

    await inMemoryRecipientsRepository.create(recipient);

    await inMemoryParcelsRepository.create(
      makeParcel(
        {
          recipientId: recipient.id,
          assignedCourierId: new UniqueEntityID("courier-1"),
        },
        new UniqueEntityID("parcel-1"),
      ),
    );

    const result = await sut.execute({
      courierId: "courier-1",
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.courierParcels.length).toBe(1);
  });

  it("should not be be able to fetch a courier parcels from another courier", async () => {
    const recipient = makeRecipient({}, new UniqueEntityID("recipient-1"));

    await inMemoryRecipientsRepository.create(recipient);

    await inMemoryParcelsRepository.create(
      makeParcel(
        {
          recipientId: recipient.id,
          assignedCourierId: new UniqueEntityID("courier-1"),
        },
        new UniqueEntityID("parcel-1"),
      ),
    );

    const result = await sut.execute({
      courierId: "courier-2",
      page: 1,
    });

    expect(result.value?.courierParcels.length).toEqual(0);
  });
});
