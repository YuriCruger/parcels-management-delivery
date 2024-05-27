import { makeParcel } from "test/factories/make-parcel";
import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { ParcelStatus } from "@/domain/delivery-management/enterprise/entities/parcel";
import { OnParcelReturned } from "./on-parcel-returned";
import { makeRecipient } from "test/factories/make-recipient";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryParcelsRepository: InMemoryParcelsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Parcel Returned", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnParcelReturned(inMemoryRecipientsRepository, sendNotificationUseCase);
  });
  it("should send a notification when a parcel is returned", async () => {
    const recipient = makeRecipient();
    inMemoryRecipientsRepository.create(recipient);

    const parcel = makeParcel({
      recipientId: recipient.id,
    });
    inMemoryParcelsRepository.create(parcel);

    parcel.status = ParcelStatus.RETURNED;

    inMemoryParcelsRepository.save(parcel);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Your parcel has been returned",
        }),
      );
    });
  });
});
