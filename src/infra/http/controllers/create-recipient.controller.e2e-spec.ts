import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Recipient (E2E)", () => {
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

  test("[POST] /recipients", async () => {
    const response = await request(app.getHttpServer())
      .post("/recipients")
      .send({
        name: "John Doe",
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
      });

    expect(response.statusCode).toBe(201);
    const recipientOnDataBase = await prisma.recipient.findFirst({
      where: {
        name: "John Doe",
      },
    });

    expect(recipientOnDataBase).toBeTruthy();
    expect(recipientOnDataBase?.latitude).toBe("37.423241");
    expect(recipientOnDataBase?.longitude).toBe("-122.0840599");
  });
});
