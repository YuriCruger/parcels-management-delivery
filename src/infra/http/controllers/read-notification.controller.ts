import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from "@nestjs/common";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { Public } from "@/infra/auth/public";

@Controller("/notifications/:notificationId/:recipientId/read")
@Public()
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param("notificationId") notificationId: string,
    @Param("recipientId") recipientId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
