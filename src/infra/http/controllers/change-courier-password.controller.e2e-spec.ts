import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { compare, hash } from "bcryptjs";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

describe("Change Courier Password (E2E)", () => {
  let app: INestApplication;
  let courierFactory: CourierFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    courierFactory = moduleRef.get(CourierFactory);

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /couriers/:courierId/change-password", async () => {
    const HASH_SALT_LENGTH = 8;
    const oldPassword = "123456";
    const newPassword = "654321";

    const courier = await courierFactory.makePrismaCourier({
      password: await hash(oldPassword, HASH_SALT_LENGTH),
    });
    const courierId = courier.id.toString();

    const accessToken = jwt.sign({ sub: courierId });

    const response = await request(app.getHttpServer())
      .patch(`/couriers/${courierId}/change-password`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ oldPassword, newPassword });

    expect(response.statusCode).toBe(200);
    expect(await compare(newPassword, response.body.courier.password)).toBe(
      true,
    );
  });
});
