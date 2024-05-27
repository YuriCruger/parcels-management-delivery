import { Module } from "@nestjs/common";
import { R2Storage } from "./r2-storage";
import { Uploader } from "@/domain/delivery-management/application/storage/uploader";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
