import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { DeleteCourierUseCase } from "@/domain/delivery-management/application/use-cases/delete-courier";

@Controller("/users/:courierId")
export class DeleteCourierController {
  constructor(private deleteCourier: DeleteCourierUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("courierId") courierId: string) {
    const result = await this.deleteCourier.execute({ courierId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
