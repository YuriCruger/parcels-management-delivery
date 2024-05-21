import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { makeParcel } from "test/factories/make-parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ParcelStatus } from "../../enterprise/entities/parcel";
import { ReturnParcelUseCase } from "./return-parcel";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let sut: ReturnParcelUseCase;

describe("Return Parcel", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    sut = new ReturnParcelUseCase(inMemoryParcelsRepository);
  });

  it("should be able to return parcel", async () => {
    inMemoryParcelsRepository.items.push(
      makeParcel(
        { assignedCourierId: new UniqueEntityID("courier-1") },
        new UniqueEntityID("parcel-1"),
      ),
    );

    const result = await sut.execute({
      parcelId: "parcel-1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryParcelsRepository.items[0].status).toEqual(
      ParcelStatus.Returned,
    );
  });

  it("should not be able to return parcel with wrong parcel id", async () => {
    const result = await sut.execute({
      parcelId: "wrong-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
