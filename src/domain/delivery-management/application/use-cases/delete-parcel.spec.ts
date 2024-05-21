import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { DeleteParcelUseCase } from "./delete-parcel";
import { makeParcel } from "test/factories/make-parcel";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let sut: DeleteParcelUseCase;

describe("Delete Parcel", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    sut = new DeleteParcelUseCase(inMemoryParcelsRepository);
  });

  it("should be able to delete a parcel", async () => {
    const parcel = makeParcel();

    await inMemoryParcelsRepository.create(parcel);

    const parcelId = parcel.id.toString();

    await sut.execute({ parcelId });

    expect(inMemoryParcelsRepository.items).toHaveLength(0);
  });
});
