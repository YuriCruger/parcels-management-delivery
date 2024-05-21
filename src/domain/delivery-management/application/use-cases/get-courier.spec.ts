import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { GetCourierUseCase } from "./get-courier";
import { makeCourier } from "test/factories/make-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let sut: GetCourierUseCase;

describe("Get Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();

    sut = new GetCourierUseCase(inMemoryCouriersRepository);
  });

  it("should be able to get a courier", async () => {
    const courier = makeCourier();

    await inMemoryCouriersRepository.create(courier);

    const courierId = courier.id.toString();

    const result = await sut.execute({ courierId });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      courier: expect.objectContaining({
        name: courier.name,
      }),
    });
  });
});
