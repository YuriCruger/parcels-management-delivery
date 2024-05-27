import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientsRepository } from "@/domain/delivery-management/application/repositories/recipients-repository";
import { ParcelDeliveredEvent } from "@/domain/delivery-management/enterprise/events/parcel-delivered-event";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnParcelAsDelivered implements EventHandler {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendParcelDeliveredNotification.bind(this),
      ParcelDeliveredEvent.name,
    );
  }

  private async sendParcelDeliveredNotification({
    parcel,
  }: ParcelDeliveredEvent) {
    const recipient = await this.recipientsRepository.findById(
      parcel.recipientId.toString(),
    );
    if (recipient) {
      await this.sendNotification.execute({
        recipientId: parcel.recipientId.toString(),
        title: `Yay! Your parcel has been delivered.`,
        content: `Please check that your parcel arrived correctly.`,
      });
    }
  }
}
