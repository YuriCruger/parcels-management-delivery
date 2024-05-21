import { makeParcel } from "test/factories/make-parcel";
import { OnParcelCreated } from "./on-parcel-created";
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

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryParcelsRepository: InMemoryParcelsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("On Parcel Created", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnParcelCreated(inMemoryRecipientsRepository, sendNotificationUseCase);
  });
  it("should send a notification when a parcel is created", async () => {
    const recipient = makeRecipient();
    inMemoryRecipientsRepository.create(recipient);

    const parcel = makeParcel({ recipientId: recipient.id });
    inMemoryParcelsRepository.create(parcel);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: recipient.id.toString(),
          title: "Your parcel is awaiting pickup",
        }),
      );
    });
  });
});
