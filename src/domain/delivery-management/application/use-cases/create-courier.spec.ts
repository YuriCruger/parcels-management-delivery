import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { CreateCourierUseCase } from "./create-courier";
import { makeCourier } from "test/factories/make-courier";
import { CourierAlreadyExistsError } from "./errors/courier-already-exists-error";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryCouriersRepository: InMemoryCouriersRepository;
let fakeHasher: FakeHasher;
let sut: CreateCourierUseCase;

describe("Create Courier", () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository();
    fakeHasher = new FakeHasher();

    sut = new CreateCourierUseCase(inMemoryCouriersRepository, fakeHasher);
  });

  it("should be able to create a courier", async () => {
    const result = await sut.execute({
      name: "John Doe",
      pin: "000.000.000-00",
      password: "123456",
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courier: inMemoryCouriersRepository.items[0],
    });
  });

  it("should hash courier password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      pin: "000.000.000-00",
      password: "123456",
      latitude: -23.5505,
      longitude: -46.6333,
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryCouriersRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });

  it("should not be able to create a courier if pin already exists", async () => {
    const courier1 = makeCourier({ pin: "000.000.000-00" });
    inMemoryCouriersRepository.create(courier1);

    const result = await sut.execute({
      name: "John Doe",
      pin: "000.000.000-00",
      password: "123456",
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CourierAlreadyExistsError);
  });
});
