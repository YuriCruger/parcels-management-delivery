import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { makeParcel } from "test/factories/make-parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ParcelStatus } from "../../enterprise/entities/parcel";
import { MarkParcelAsDeliveredUseCase } from "./mark-parcel-as-delivered";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidFileTypeError } from "./errors/invalid-file-type-error";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let fakeUploader: FakeUploader;
let sut: MarkParcelAsDeliveredUseCase;

describe("Mark Parcel as Delivered", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();
    fakeUploader = new FakeUploader();

    sut = new MarkParcelAsDeliveredUseCase(
      inMemoryParcelsRepository,
      fakeUploader,
    );
  });

  it("should mark parcel as delivered", async () => {
    inMemoryParcelsRepository.items.push(
      makeParcel(
        { assignedCourierId: new UniqueEntityID("courier-1") },
        new UniqueEntityID("parcel-1"),
      ),
    );

    const result = await sut.execute({
      parcelId: "parcel-1",
      courierId: "courier-1",
      photo: {
        fileName: "delivered.png",
        fileType: "image/png",
        body: Buffer.from(""),
      },
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryParcelsRepository.items[0].status).toEqual(
      ParcelStatus.DELIVERED,
    );
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "delivered.png",
      }),
    );
  });

  it("should not be able to mark parcel if is not assigned to the right courier", async () => {
    inMemoryParcelsRepository.items.push(
      makeParcel(
        { assignedCourierId: new UniqueEntityID("courier-2") },
        new UniqueEntityID("parcel-1"),
      ),
    );

    const result = await sut.execute({
      parcelId: "parcel-1",
      courierId: "courier-1",
      photo: {
        fileName: "delivered.png",
        fileType: "image/png",
        body: Buffer.from(""),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to upload an photo with invalid file type", async () => {
    const result = await sut.execute({
      parcelId: "parcel-1",
      courierId: "courier-1",
      photo: {
        fileName: "profile.mp3",
        fileType: "audio/mpeg",
        body: Buffer.from(""),
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidFileTypeError);
  });
});
