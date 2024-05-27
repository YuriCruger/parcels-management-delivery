import { Either, left, right } from "@/core/either";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Parcel, ParcelStatus } from "../../enterprise/entities/parcel";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { InvalidFileTypeError } from "./errors/invalid-file-type-error";
import { UploadParams, Uploader } from "../storage/uploader";
import { Injectable } from "@nestjs/common";

interface MarkParcelAsDeliveredUseCaseRequest {
  parcelId: string;
  courierId: string;
  photo: UploadParams;
}

type MarkParcelAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError,
  { parcel: Parcel }
>;

@Injectable()
export class MarkParcelAsDeliveredUseCase {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    parcelId,
    courierId,
    photo,
  }: MarkParcelAsDeliveredUseCaseRequest): Promise<MarkParcelAsDeliveredUseCaseResponse> {
    const imageFileTypeRegex = /^image\/(png|jpeg|webp)$/;

    if (!imageFileTypeRegex.test(photo.fileType)) {
      return left(new InvalidFileTypeError(photo.fileType));
    }

    const parcel = await this.parcelsRepository.findById(parcelId);

    if (!parcel) {
      return left(new ResourceNotFoundError());
    }

    if (parcel.assignedCourierId?.toString() !== courierId) {
      return left(new NotAllowedError());
    }

    const { url } = await this.uploader.upload({
      fileName: photo.fileName,
      fileType: photo.fileType,
      body: photo.body,
    });

    parcel.url = url;
    parcel.status = ParcelStatus.DELIVERED;

    await this.parcelsRepository.save(parcel);

    return right({ parcel });
  }
}
