import { makeParcel } from "test/factories/make-parcel";
import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeRecipient } from "test/factories/make-recipient";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryCouriersRepository } from "test/repositories/in-memory-couriers-repository";
import { OnParcelInTransit } from "./on-parcel-in-transit";
import { ParcelStatus } from "@/domain/delivery-management/enterprise/entities/parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryParcelsRepository: InMemoryParcelsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryCouriersRepository: InMemoryCouriersRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Parcel In Transit", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    inMemoryCouriersRepository = new InMemoryCouriersRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnParcelInTransit(
      inMemoryRecipientsRepository,
      sendNotificationUseCase,
    );
  });
  it("should send a notification when a parcel is in transit", async () => {
    const courier = makeCourier();
    inMemoryCouriersRepository.create(courier);

    const courierId = courier.id.toString();

    const recipient = makeRecipient();
    inMemoryRecipientsRepository.create(recipient);

    const parcel = makeParcel({
      recipientId: recipient.id,
    });
    inMemoryParcelsRepository.create(parcel);

    parcel.assignedCourierId = new UniqueEntityID(courierId);
    parcel.status = ParcelStatus.InTransit;

    inMemoryParcelsRepository.save(parcel);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: recipient.id.toString(),
          title: "Your parcel is on the way!",
        }),
      );
    });
  });
});
