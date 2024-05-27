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

describe("Delete Parcel (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let courierFactory: CourierFactory;
  let parcelFactory: ParcelFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, ParcelFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    courierFactory = moduleRef.get(CourierFactory);
    parcelFactory = moduleRef.get(ParcelFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[DELETE] /parcels/:parcelId", async () => {
    const { accessToken } = await makeUserAndAuthenticate(jwt, courierFactory);

    const recipient = await recipientFactory.makePrismaRecipient();

    const parcel = await parcelFactory.makePrismaParcel({
      recipientId: recipient.id,
    });

    const parcelId = parcel.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/parcels/${parcelId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const parcelOnDataBase = await prisma.parcel.findUnique({
      where: {
        id: parcelId,
      },
    });

    expect(parcelOnDataBase).toBeNull();
  });
});
