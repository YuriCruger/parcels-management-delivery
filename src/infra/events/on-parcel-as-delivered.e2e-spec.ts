import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { ParcelFactory } from "test/factories/make-parcel";
import { RecipientFactory } from "test/factories/make-recipient";
import { makeUserAndAuthenticate } from "test/factories/make-user-and-authenticate";
import { waitFor } from "test/utils/wait-for";

describe("Notification On Parcel as Delivered (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let courierFactory: CourierFactory;
  let parcelFactory: ParcelFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, CourierFactory, ParcelFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    recipientFactory = moduleRef.get(RecipientFactory);
    courierFactory = moduleRef.get(CourierFactory);
    parcelFactory = moduleRef.get(ParcelFactory);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should send a notification when parcel as delivered", async () => {
    const { accessToken, userId, user } = await makeUserAndAuthenticate(
      jwt,
      courierFactory,
    );

    const recipient = await recipientFactory.makePrismaRecipient();

    const parcel = await parcelFactory.makePrismaParcel({
      recipientId: recipient.id,
      assignedCourierId: user.id,
    });

    const parcelId = parcel.id.toString();

    await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/${userId}/delivered`)
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", "./test/e2e/sample-upload.jpg");

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      });
      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
