import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";
import { ReturnParcelUseCase } from "@/domain/delivery-management/application/use-cases/return-parcel";

@Controller("/parcels/:parcelId/return")
export class ReturnParcelController {
  constructor(private returnParcel: ReturnParcelUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param("parcelId") parcelId: string) {
    const result = await this.returnParcel.execute({
      parcelId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
