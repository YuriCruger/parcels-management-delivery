import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { DeleteCourierUseCase } from "./delete-courier";
import { makeCourier } from "test/factories/make-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let sut: DeleteCourierUseCase;

describe("Delete Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();

    sut = new DeleteCourierUseCase(inMemoryCouriersRepository);
  });

  it("should be able to delete a courier", async () => {
    const courier = makeCourier();

    await inMemoryCouriersRepository.create(courier);

    const courierId = courier.id.toString();

    await sut.execute({ courierId });

    expect(inMemoryCouriersRepository.items).toHaveLength(0);
  });
});
