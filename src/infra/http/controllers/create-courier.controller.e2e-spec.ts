import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Courier (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /register", async () => {
    const response = await request(app.getHttpServer()).post("/register").send({
      name: "John Doe",
      pin: "000.000.000-00",
      password: "123456",
      latitude: -23.5505,
      longitude: -46.6333,
    });

    expect(response.statusCode).toBe(201);

    const courierOnDataBase = await prisma.user.findUnique({
      where: {
        pin: "000.000.000-00",
      },
    });

    expect(courierOnDataBase).toBeTruthy();
  });
});
