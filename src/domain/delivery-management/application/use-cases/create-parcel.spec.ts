import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { CreateParcelUseCase } from "./create-parcel";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let sut: CreateParcelUseCase;

describe("Create Parcel", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    sut = new CreateParcelUseCase(inMemoryParcelsRepository);
  });

  it("should be able to create a parcel", async () => {
    const result = await sut.execute({
      recipientId: "recipient-1",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.parcel.recipientId.toValue()).toEqual("recipient-1");
  });
});
