import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { makeParcel } from "test/factories/make-parcel";
import { AssignParcelToCourierUseCase } from "./assign-parcel-to-courier";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ParcelStatus } from "../../enterprise/entities/parcel";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let inMemoryParcelsRepository: InMemoryParcelsRepository;
let sut: AssignParcelToCourierUseCase;

describe("Assign Parcel to Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    sut = new AssignParcelToCourierUseCase(inMemoryParcelsRepository);
  });

  it("should be able to assign parcel to courier", async () => {
    inMemoryCouriersRepository.items.push(
      makeCourier({}, new UniqueEntityID("courier-1")),
    );

    inMemoryParcelsRepository.items.push(
      makeParcel({}, new UniqueEntityID("parcel-1")),
    );

    const result = await sut.execute({
      parcelId: "parcel-1",
      courierId: "courier-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryParcelsRepository.items[0].assignedCourierId).toEqual(
      new UniqueEntityID("courier-1"),
    );
    expect(inMemoryParcelsRepository.items[0].status).toEqual(
      ParcelStatus.InTransit,
    );
  });

  it("should not allow reassignment of parcel if already assigned to a courier", async () => {
    inMemoryCouriersRepository.items.push(
      makeCourier({}, new UniqueEntityID("courier-1")),
    );

    inMemoryCouriersRepository.items.push(
      makeCourier({}, new UniqueEntityID("courier-2")),
    );

    inMemoryParcelsRepository.items.push(
      makeParcel(
        { assignedCourierId: new UniqueEntityID("courier-1") },
        new UniqueEntityID("parcel-1"),
      ),
    );

    const result = await sut.execute({
      parcelId: "parcel-1",
      courierId: "courier-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
