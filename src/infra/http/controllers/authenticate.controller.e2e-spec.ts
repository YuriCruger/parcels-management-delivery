import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let courierFactory: CourierFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    courierFactory = moduleRef.get(CourierFactory);

    await app.init();
  });

  test("[POST] /sessions", async () => {
    await courierFactory.makePrismaCourier({
      pin: "000.000.000-00",
      password: await hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      pin: "000.000.000-00",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
