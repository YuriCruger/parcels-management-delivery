import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { FetchCourierNearbyParcelsUseCase } from "./fetch-courier-nearby-parcels";
import { makeParcel } from "test/factories/make-parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { makeRecipient } from "test/factories/make-recipient";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchCourierNearbyParcelsUseCase;

describe("Fetch Courier Nearby Parcels", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new FetchCourierNearbyParcelsUseCase(
      inMemoryParcelsRepository,
      inMemoryRecipientsRepository,
    );
  });

  it("should be able to fetch a courier nearby parcels", async () => {
    const recipient = makeRecipient(
      {
        latitude: -31.6991463,
        longitude: -52.3698176,
      },
      new UniqueEntityID("recipient-1"),
    );

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
      courierLatitude: -31.6398473, // (nearby)
      courierLongitude: -52.3372202, // (nearby)
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.courierNearbyParcels.length).toBe(1);
  });

  it("should not be able to fetch parcels far from the courier", async () => {
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
      courierLatitude: -31.5922281, // (far)
      courierLongitude: -52.28761, // (far)
      page: 1,
    });

    expect(result.value?.courierNearbyParcels.length).toEqual(0);
  });
});
