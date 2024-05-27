import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateParcelUseCase } from "@/domain/delivery-management/application/use-cases/create-parcel";

const createParcelBodySchema = z.object({
  recipientId: z.string(),
});

type CreateParcelBodySchema = z.infer<typeof createParcelBodySchema>;

@Controller("/parcels")
export class CreateParcelController {
  constructor(private createParcel: CreateParcelUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createParcelBodySchema))
  async handle(@Body() body: CreateParcelBodySchema) {
    const { recipientId } = body;

    const result = await this.createParcel.execute({
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
