import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { makeCourier } from "test/factories/make-courier";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateCourierUseCase } from "./authenticate-courier";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateCourierUseCase;

describe("Authenticate Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateCourierUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it("should be able to authenticate a courier", async () => {
    const courier = makeCourier({
      pin: "000.000.000-00",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryCouriersRepository.items.push(courier);

    const result = await sut.execute({
      pin: "000.000.000-00",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
