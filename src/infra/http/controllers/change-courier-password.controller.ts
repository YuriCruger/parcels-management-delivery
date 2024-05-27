import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { WrongCredentialsError } from "@/domain/delivery-management/application/use-cases/errors/wrong-credentials-error";
import { ChangeCourierPasswordUseCase } from "@/domain/delivery-management/application/use-cases/change-courier-password";
import { CourierPresenter } from "../presenters/courier-presenter";

const changeCourierPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(
  changeCourierPasswordBodySchema,
);

type ChangeCourierPasswordBodySchema = z.infer<
  typeof changeCourierPasswordBodySchema
>;

@Controller("/couriers/:courierId/change-password")
export class ChangeCourierPasswordController {
  constructor(private changeCourierPassword: ChangeCourierPasswordUseCase) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: ChangeCourierPasswordBodySchema,
    @Param("courierId") courierId: string,
  ) {
    const { oldPassword, newPassword } = body;

    const result = await this.changeCourierPassword.execute({
      courierId,
      oldPassword,
      newPassword,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { courier } = result.value;

    return {
      courier: CourierPresenter.toHTTP(courier),
    };
  }
}
