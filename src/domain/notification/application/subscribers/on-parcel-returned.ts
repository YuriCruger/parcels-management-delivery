import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientRepository } from "@/domain/delivery-management/application/repositories/recipient-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { ParcelReturnedEvent } from "@/domain/delivery-management/enterprise/events/parcel-returned-event";

export class OnParcelReturned implements EventHandler {
  constructor(
    private recipientRepository: RecipientRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParcelDeliveredNotification.bind(this),
      ParcelReturnedEvent.name,
    );
  }

  private async sendParcelDeliveredNotification({
    parcel,
  }: ParcelReturnedEvent) {
    const recipient = await this.recipientRepository.findById(
      parcel.recipientId.toString(),
    );

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: parcel.recipientId.toString(),
        title: "Your parcel has been returned",
        content: "We have received your return request.",
      });
    }
  }
}
