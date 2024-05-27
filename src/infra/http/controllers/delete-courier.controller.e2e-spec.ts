import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CourierFactory } from "test/factories/make-courier";
import { makeUserAndAuthenticate } from "test/factories/make-user-and-authenticate";

describe("Delete Courier (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let courierFactory: CourierFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    courierFactory = moduleRef.get(CourierFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[DELETE] /users/:courierId", async () => {
    const { accessToken, userId } = await makeUserAndAuthenticate(
      jwt,
      courierFactory,
    );

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const courierOnDataBase = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    expect(courierOnDataBase).toBeNull();
  });
});
