import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/delivery-management/application/repositories/recipients-repository";
import { ParcelCreatedEvent } from "@/domain/delivery-management/enterprise/events/parcel-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnParcelCreated implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParcelDeliveredNotification.bind(this),
      ParcelCreatedEvent.name,
    );
  }

  private async sendParcelDeliveredNotification({
    parcel,
  }: ParcelCreatedEvent) {
    const recipient = await this.recipientsRepository.findById(
      parcel.recipientId.toString(),
    );

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: parcel.recipientId.toString(),
        title: "Your parcel is awaiting pickup",
        content: `As soon as a delivery person picks up your package, it will be immediately taken to you.`,
      });
    }
  }
}
