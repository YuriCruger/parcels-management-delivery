import { CreateCourierUseCase } from "@/domain/delivery-management/application/use-cases/create-courier";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CourierAlreadyExistsError } from "@/domain/delivery-management/application/use-cases/errors/courier-already-exists-error";
import { Public } from "@/infra/auth/public";

const createCourierBodySchema = z.object({
  name: z.string(),
  pin: z.string(),
  password: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

type CreateCourierBodySchema = z.infer<typeof createCourierBodySchema>;

@Controller("/register")
@Public()
export class CreateCourierController {
  constructor(private createCourier: CreateCourierUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCourierBodySchema))
  async handle(@Body() body: CreateCourierBodySchema) {
    const { name, pin, password, latitude, longitude } = body;

    const result = await this.createCourier.execute({
      name,
      pin,
      password,
      latitude,
      longitude,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourierAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
