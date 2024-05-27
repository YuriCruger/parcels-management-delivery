import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { RecipientFactory } from "test/factories/make-recipient";
import { makeUserAndAuthenticate } from "test/factories/make-user-and-authenticate";

describe("Create Parcel (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let recipientFactory: RecipientFactory;
  let courierFactory: CourierFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    recipientFactory = moduleRef.get(RecipientFactory);
    courierFactory = moduleRef.get(CourierFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /parcels", async () => {
    const { accessToken } = await makeUserAndAuthenticate(jwt, courierFactory);

    const recipient = await recipientFactory.makePrismaRecipient();

    const response = await request(app.getHttpServer())
      .post("/parcels")
      .send({
        recipientId: recipient.id.toString(),
      })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(201);

    const parcelOnDataBase = await prisma.parcel.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      },
    });

    expect(parcelOnDataBase).toBeTruthy();
    expect(parcelOnDataBase.recipientId).toBe(recipient.id.toString());
  });
});
