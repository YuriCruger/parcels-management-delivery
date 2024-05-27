import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { GetCourierUseCase } from "@/domain/delivery-management/application/use-cases/get-courier";
import { CourierPresenter } from "../presenters/courier-presenter";

@Controller("/users/:courierId")
export class GetCourierController {
  constructor(private getCourier: GetCourierUseCase) {}

  @Get()
  async handle(@Param("courierId") courierId: string) {
    const result = await this.getCourier.execute({ courierId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { courier: CourierPresenter.toHTTP(result.value.courier) };
  }
}
