import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { makeCourier } from "test/factories/make-courier";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { ChangeCourierPasswordUseCase } from "./change-courier-password";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let fakeHasher: FakeHasher;
let sut: ChangeCourierPasswordUseCase;

describe("Change Courier Password", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();

    sut = new ChangeCourierPasswordUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
      fakeHasher,
    );
  });

  it("should be able to change a courier password", async () => {
    const oldPassword = "123456";
    const newPassword = "654321";

    const courier = makeCourier({
      password: await fakeHasher.hash(oldPassword),
    });
    const courierId = courier.id.toString();

    inMemoryCouriersRepository.items.push(courier);

    const result = await sut.execute({
      courierId,
      oldPassword,
      newPassword,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courier: expect.objectContaining({
        password: await fakeHasher.hash(newPassword),
      }),
    });
  });
});
