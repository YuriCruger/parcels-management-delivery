import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { FetchCourierNearbyParcelsUseCase } from "@/domain/delivery-management/application/use-cases/fetch-courier-nearby-parcels";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ParcelPresenter } from "../presenters/parcel-presenter";

const fetchCourierParcelsBodySchema = z.object({
  courierLatitude: z.number(),
  courierLongitude: z.number(),
});

const bodyValidationPipe = new ZodValidationPipe(fetchCourierParcelsBodySchema);

type FetchCourierParcelsBodySchema = z.infer<
  typeof fetchCourierParcelsBodySchema
>;

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/couriers/:courierId/parcels")
export class FetchCourierNearbyParcelsController {
  constructor(private fetchParcels: FetchCourierNearbyParcelsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Param("courierId") courierId: string,
    @Body(bodyValidationPipe) body: FetchCourierParcelsBodySchema,
  ) {
    const { courierLatitude, courierLongitude } = body;
    const result = await this.fetchParcels.execute({
      page,
      courierId,
      courierLatitude,
      courierLongitude,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const courierParcels = result.value.courierNearbyParcels;

    return {
      courierNearbyParcels: courierParcels.map(ParcelPresenter.toHTTP),
    };
  }
}
