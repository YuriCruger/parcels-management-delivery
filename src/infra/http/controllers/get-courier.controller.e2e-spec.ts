import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { makeUserAndAuthenticate } from "test/factories/make-user-and-authenticate";

describe("GET Courier (E2E)", () => {
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

  test("[GET] /users/:courierId", async () => {
    const { accessToken, userId } = await makeUserAndAuthenticate(
      jwt,
      courierFactory,
    );

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      courier: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        pin: expect.any(String),
        password: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    });
  });
});
