import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { MarkParcelAsDeliveredUseCase } from "@/domain/delivery-management/application/use-cases/mark-parcel-as-delivered";
import { UploadParams } from "@/domain/delivery-management/application/storage/uploader";
import { FileInterceptor } from "@nestjs/platform-express";
import { InvalidFileTypeError } from "@/domain/delivery-management/application/use-cases/errors/invalid-file-type-error";

@Controller("/parcels/:parcelId/:courierId/delivered")
export class MarkParcelAsDeliveredController {
  constructor(private markParcelAsDelivered: MarkParcelAsDeliveredUseCase) {}

  @Patch()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @Param("parcelId") parcelId: string,
    @Param("courierId") courierId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: "(png|jpeg|webp)",
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const uploadParams: UploadParams = {
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    };

    const result = await this.markParcelAsDelivered.execute({
      parcelId,
      courierId,
      photo: uploadParams,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidFileTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { parcel } = result.value;

    return {
      parcelId: parcel.id.toString(),
    };
  }
}
