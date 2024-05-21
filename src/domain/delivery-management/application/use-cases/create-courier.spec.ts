import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { CreateCourierUseCase } from "./create-courier";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let sut: CreateCourierUseCase;

describe("Create Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();

    sut = new CreateCourierUseCase(inMemoryCouriersRepository);
  });

  it("should be able to create a courier", async () => {
    const result = await sut.execute({
      name: "John Doe",
      pin: "000.000.000-00",
      latitude: "-23.5505",
      longitude: "-46.6333",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.courier.id).toEqual(expect.any(UniqueEntityID));
  });
});
