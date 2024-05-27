import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { OnParcelCreated } from "@/domain/notification/application/subscribers/on-parcel-created";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { OnParcelAsDelivered } from "@/domain/notification/application/subscribers/on-parcel-as-delivered";
import { OnParcelInTransit } from "@/domain/notification/application/subscribers/on-parcel-in-transit";
import { OnParcelReturned } from "@/domain/notification/application/subscribers/on-parcel-returned";

@Module({
  imports: [DatabaseModule],
  providers: [
    OnParcelCreated,
    OnParcelAsDelivered,
    OnParcelInTransit,
    OnParcelReturned,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
