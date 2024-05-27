import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { ParcelStatus } from "@prisma/client";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { ParcelFactory } from "test/factories/make-parcel";
import { RecipientFactory } from "test/factories/make-recipient";
import { makeUserAndAuthenticate } from "test/factories/make-user-and-authenticate";

describe("Return Parcel (E2E)", () => {
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

    await app.init();
  });

  test("[PATCH] /parcels/:parcelId", async () => {
    const { accessToken } = await makeUserAndAuthenticate(jwt, courierFactory);

    const recipient = await recipientFactory.makePrismaRecipient();

    const parcel = await parcelFactory.makePrismaParcel({
      recipientId: recipient.id,
    });

    const parcelId = parcel.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/parcels/${parcelId}/return`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const parcelOnDataBase = await prisma.parcel.findUnique({
      where: {
        id: parcelId,
      },
    });

    expect(parcelOnDataBase.status).toBe(ParcelStatus.RETURNED);
  });
});
