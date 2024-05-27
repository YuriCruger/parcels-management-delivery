import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateCourierController } from "./controllers/create-courier.controller";
import { CreateCourierUseCase } from "@/domain/delivery-management/application/use-cases/create-courier";
import { CryptoGraphyModule } from "../cryptography/cryptography.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { AuthenticateCourierUseCase } from "@/domain/delivery-management/application/use-cases/authenticate-courier";
import { DeleteCourierController } from "./controllers/delete-courier.controller";
import { DeleteCourierUseCase } from "@/domain/delivery-management/application/use-cases/delete-courier";
import { GetCourierController } from "./controllers/get-courier.controller";
import { GetCourierUseCase } from "@/domain/delivery-management/application/use-cases/get-courier";
import { CreateRecipientController } from "./controllers/create-recipient.controller";
import { CreateRecipientUseCase } from "@/domain/delivery-management/application/use-cases/create-recipient";
import { CreateParcelController } from "./controllers/create-parcel.controller";
import { CreateParcelUseCase } from "@/domain/delivery-management/application/use-cases/create-parcel";
import { DeleteParcelController } from "./controllers/delete-parcel.controller";
import { DeleteParcelUseCase } from "@/domain/delivery-management/application/use-cases/delete-parcel";
import { ReturnParcelController } from "./controllers/return-parcel.controller";
import { ReturnParcelUseCase } from "@/domain/delivery-management/application/use-cases/return-parcel";
import { AssignParcelToCourierController } from "./controllers/assign-parcel-to-courier.controller";
import { AssignParcelToCourierUseCase } from "@/domain/delivery-management/application/use-cases/assign-parcel-to-courier";
import { FetchCourierNearbyParcelsController } from "./controllers/fetch-courier-nearby-parcels.controller";
import { FetchCourierNearbyParcelsUseCase } from "@/domain/delivery-management/application/use-cases/fetch-courier-nearby-parcels";
import { MarkParcelAsDeliveredUseCase } from "@/domain/delivery-management/application/use-cases/mark-parcel-as-delivered";
import { MarkParcelAsDeliveredController } from "./controllers/mark-parcel-as-delivered";
import { StorageModule } from "../storage/storage.module";
import { ListCourierParcelsController } from "./controllers/list-courier-parcels";
import { ListCourierParcelsUseCase } from "@/domain/delivery-management/application/use-cases/list-courier-parcels";
import { ReadNotificationController } from "./controllers/read-notification.controller";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { ChangeCourierPasswordController } from "./controllers/change-courier-password.controller";
import { ChangeCourierPasswordUseCase } from "@/domain/delivery-management/application/use-cases/change-courier-password";

@Module({
  imports: [DatabaseModule, CryptoGraphyModule, StorageModule],
  controllers: [
    CreateCourierController,
    AuthenticateController,
    DeleteCourierController,
    GetCourierController,
    CreateRecipientController,
    CreateParcelController,
    DeleteParcelController,
    ReturnParcelController,
    AssignParcelToCourierController,
    FetchCourierNearbyParcelsController,
    MarkParcelAsDeliveredController,
    ListCourierParcelsController,
    ReadNotificationController,
    ChangeCourierPasswordController,
  ],
  providers: [
    CreateCourierUseCase,
    AuthenticateCourierUseCase,
    DeleteCourierUseCase,
    GetCourierUseCase,
    CreateRecipientUseCase,
    CreateParcelUseCase,
    DeleteParcelUseCase,
    ReturnParcelUseCase,
    AssignParcelToCourierUseCase,
    FetchCourierNearbyParcelsUseCase,
    MarkParcelAsDeliveredUseCase,
    ListCourierParcelsUseCase,
    ReadNotificationUseCase,
    ChangeCourierPasswordUseCase,
  ],
})
export class HttpModule {}
