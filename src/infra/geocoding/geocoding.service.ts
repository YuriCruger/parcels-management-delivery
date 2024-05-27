import { Injectable, Logger } from "@nestjs/common";
import { Client } from "@googlemaps/google-maps-services-js";
import { EnvService } from "../env/env.service";

@Injectable()
export class GeocodingService {
  private client: Client;
  private readonly logger = new Logger(GeocodingService.name);

  constructor(private envService: EnvService) {
    this.client = new Client({});
  }

  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.envService.get("GOOGLE_MAPS_API_KEY"),
        },
      });

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      this.logger.error("Geocoding error", error);
      throw new Error("Failed to geocode address");
    }
  }
}
