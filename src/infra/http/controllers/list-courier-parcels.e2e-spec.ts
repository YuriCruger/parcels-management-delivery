import { ParcelStatus } from "@/domain/delivery-management/enterprise/entities/parcel";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { ParcelFactory } from "test/factories/make-parcel";
import { RecipientFactory } from "test/factories/make-recipient";
import { makeUserAndAuthenticate } from "test/factories/make-user-and-authenticate";

describe("List Courier Parcels (E2E)", () => {
  let app: INestApplication;

  let courierFactory: CourierFactory;
  let recipientFactory: RecipientFactory;
  let parcelFactory: ParcelFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, ParcelFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    courierFactory = moduleRef.get(CourierFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    parcelFactory = moduleRef.get(ParcelFactory);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /couriers/:courierId/list-parcels", async () => {
    const { accessToken, user, userId } = await makeUserAndAuthenticate(
      jwt,
      courierFactory,
    );

    const recipient = await recipientFactory.makePrismaRecipient();

    await parcelFactory.makePrismaParcel({
      recipientId: recipient.id,
      assignedCourierId: user.id,
      status: ParcelStatus.IN_TRANSIT,
    });

    await parcelFactory.makePrismaParcel({
      recipientId: recipient.id,
      assignedCourierId: user.id,
      status: ParcelStatus.IN_TRANSIT,
    });

    const response = await request(app.getHttpServer())
      .get(`/couriers/${userId}/list-parcels`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      courierParcels: [
        expect.objectContaining({
          assignedCourierId: user.id.toString(),
        }),
        expect.objectContaining({
          assignedCourierId: user.id.toString(),
        }),
      ],
    });
  });
});
