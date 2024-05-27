import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ParcelPresenter } from "../presenters/parcel-presenter";
import { ListCourierParcelsUseCase } from "@/domain/delivery-management/application/use-cases/list-courier-parcels";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/couriers/:courierId/list-parcels")
export class ListCourierParcelsController {
  constructor(private listCourierParcels: ListCourierParcelsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("courierId") courierId: string,
  ) {
    const result = await this.listCourierParcels.execute({
      page,
      courierId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const courierParcels = result.value.courierParcels;

    return {
      courierParcels: courierParcels.map(ParcelPresenter.toHTTP),
    };
  }
}
