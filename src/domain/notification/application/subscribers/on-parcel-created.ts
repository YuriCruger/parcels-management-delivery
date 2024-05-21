import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { RecipientRepository } from "@/domain/delivery-management/application/repositories/recipient-repository";
import { ParcelCreatedEvent } from "@/domain/delivery-management/enterprise/events/parcel-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnParcelCreated implements EventHandler {
  constructor(
    private recipientRepository: RecipientRepository,
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
    const recipient = await this.recipientRepository.findById(
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
// TODO: Seria interessante ter alguma informação do pacote para enviar na notificação? Um nome ou um id de pedido que fosse possível rastrear. É ideal enviar o próprio ID desse pacote na notificação?
