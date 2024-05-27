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
import { CreateRecipientUseCase } from "@/domain/delivery-management/application/use-cases/create-recipient";
import { Public } from "@/infra/auth/public";

const createRecipientBodySchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller("/recipients")
@Public()
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, latitude, longitude } = body;

    const result = await this.createRecipient.execute({
      name,
      latitude,
      longitude,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
