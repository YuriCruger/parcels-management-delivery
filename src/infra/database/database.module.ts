import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CouriersRepository } from "@/domain/delivery-management/application/repositories/couriers-repository";
import { PrismaCouriersRepository } from "./prisma/repositories/prisma-couriers-repository";
import { RecipientsRepository } from "@/domain/delivery-management/application/repositories/recipients-repository";
import { PrismaRecipientsRepository } from "./prisma/repositories/prisma-recipients-repository";
import { ParcelsRepository } from "@/domain/delivery-management/application/repositories/parcels-repository";
import { PrismaParcelsRepository } from "./prisma/repositories/prisma-parcels-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: ParcelsRepository,
      useClass: PrismaParcelsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    CouriersRepository,
    RecipientsRepository,
    ParcelsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
