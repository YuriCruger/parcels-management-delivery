import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { GeocodingService } from "./geocoding.service";

@Module({
  imports: [EnvModule],
  providers: [GeocodingService],
  exports: [GeocodingService],
})
export class GeocodingModule {}
