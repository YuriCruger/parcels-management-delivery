import { InMemoryParcelsRepository } from "test/repositories/in-memory-parcels-repository";
import { makeParcel } from "test/factories/make-parcel";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ParcelStatus } from "@/domain/delivery-management/enterprise/entities/parcel";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { OnParcelAsDelivered } from "./on-parcel-as-delivered";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { InMemoryRecipientsRepository } from "test/repositories/in-memory-recipients-repository";
import { makeRecipient } from "test/factories/make-recipient";

let inMemoryParcelsRepository: InMemoryParcelsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("Mark Parcel as Delivered", () => {
  beforeEach(() => {
    inMemoryParcelsRepository = new InMemoryParcelsRepository();

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnParcelAsDelivered(
      inMemoryRecipientsRepository,
      sendNotificationUseCase,
    );
  });

  it("should mark parcel as delivered and send notification", async () => {
    const recipient = makeRecipient();
    inMemoryRecipientsRepository.create(recipient);

    const parcel = makeParcel(
      {
        assignedCourierId: new UniqueEntityID("courier-1"),
        recipientId: recipient.id,
      },
      new UniqueEntityID("parcel-1"),
    );

    inMemoryParcelsRepository.create(parcel);

    parcel.url = "fake-url";
    parcel.status = ParcelStatus.Delivered;

    inMemoryParcelsRepository.save(parcel);

    expect(inMemoryParcelsRepository.items[0].status).toEqual(
      ParcelStatus.Delivered,
    );
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
