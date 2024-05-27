import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/delivery-management/application/repositories/recipients-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { ParcelInTransitEvent } from "@/domain/delivery-management/enterprise/events/parcel-in-transit-event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnParcelInTransit implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParcelDeliveredNotification.bind(this),
      ParcelInTransitEvent.name,
    );
  }

  private async sendParcelDeliveredNotification({
    parcel,
  }: ParcelInTransitEvent) {
    const recipient = await this.recipientsRepository.findById(
      parcel.recipientId.toString(),
    );

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: parcel.recipientId.toString(),
        title: "Your parcel is on the way!",
        content:
          "Your parcel has been picked up by the delivery person and is on its way.",
      });
    }
  }
}
