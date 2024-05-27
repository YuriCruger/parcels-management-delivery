import { DeleteParcelUseCase } from "@/domain/delivery-management/application/use-cases/delete-parcel";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";

@Controller("/parcels/:parcelId")
export class DeleteParcelController {
  constructor(private deleteParcel: DeleteParcelUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("parcelId") parcelId: string) {
    const result = await this.deleteParcel.execute({ parcelId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
