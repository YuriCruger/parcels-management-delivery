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

describe("Fetch Courier Nearby Parcels (E2E)", () => {
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

  test("[GET] /couriers/:courierId/parcels", async () => {
    const user = await courierFactory.makePrismaCourier({
      latitude: -31.6398473,
      longitude: -52.3372202,
    });

    const userId = user.id.toString();

    const accessToken = jwt.sign({ sub: userId });

    const recipient = await recipientFactory.makePrismaRecipient({
      latitude: -31.6991463,
      longitude: -52.3698176,
    });

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
      .get(`/couriers/${userId}/parcels`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        courierLatitude: user.latitude,
        courierLongitude: user.longitude,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      courierNearbyParcels: [
        expect.objectContaining({
          assignedCourierId: userId,
        }),
        expect.objectContaining({
          assignedCourierId: userId,
        }),
      ],
    });
  });
});
