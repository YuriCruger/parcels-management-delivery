import { PaginationParams } from "@/core/repositories/pagination-params";
import { Parcel } from "../../enterprise/entities/parcel";

export abstract class ParcelsRepository {
  abstract findById(id: string): Promise<Parcel | null>;
  abstract findManyByCourierId(
    courierId: string,
    params: PaginationParams,
  ): Promise<Parcel[]>;

  abstract create(parcel: Parcel): Promise<void>;
  abstract save(parcel: Parcel): Promise<void>;
  abstract delete(parcel: Parcel): Promise<void>;
}
