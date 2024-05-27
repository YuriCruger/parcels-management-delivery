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
import { GeocodingService } from "@/infra/geocoding/geocoding.service";

const createRecipientBodySchema = z.object({
  name: z.string(),
  address: z.string(),
});

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller("/recipients")
@Public()
export class CreateRecipientController {
  constructor(
    private createRecipient: CreateRecipientUseCase,
    private readonly geocodingService: GeocodingService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, address } = body;

    const { lat, lng } = await this.geocodingService.geocode(address);

    const result = await this.createRecipient.execute({
      name,
      latitude: lat,
      longitude: lng,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return result.value;
  }
}
