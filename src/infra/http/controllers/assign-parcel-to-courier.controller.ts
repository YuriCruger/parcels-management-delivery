import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";
import { AssignParcelToCourierUseCase } from "@/domain/delivery-management/application/use-cases/assign-parcel-to-courier";

@Controller("/parcels/:parcelId/assign/:courierId")
export class AssignParcelToCourierController {
  constructor(private assignParcelToCourier: AssignParcelToCourierUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("parcelId") parcelId: string,
    @Param("courierId") courierId: string,
  ) {
    const result = await this.assignParcelToCourier.execute({
      parcelId,
      courierId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
