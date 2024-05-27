import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/make-notification";
import { RecipientFactory } from "test/factories/make-recipient";

describe("Read notification (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let notificationFactory: NotificationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    recipientFactory = moduleRef.get(RecipientFactory);
    notificationFactory = moduleRef.get(NotificationFactory);

    await app.init();
  });

  test("[PATCH] /notifications/:notificationId/read", async () => {
    const recipient = await recipientFactory.makePrismaRecipient();
    const recipientId = recipient.id.toString();

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: recipient.id,
    });

    const notificationId = notification.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/${recipientId}/read`)
      .send();

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      },
    });

    expect(notificationOnDatabase?.readAt).not.toBeNull();
  });
});
