import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { ParcelsRepository } from "@/domain/delivery-management/application/repositories/parcels-repository";
import { Parcel } from "@/domain/delivery-management/enterprise/entities/parcel";

export class InMemoryParcelsRepository implements ParcelsRepository {
  public items: Parcel[] = [];

  async findById(id: string) {
    const parcel = this.items.find((item) => item.id.toString() === id);

    if (!parcel) {
      return null;
    }

    return parcel;
  }

  async findManyByCourierId(courierId: string, { page }: PaginationParams) {
    const courierParcels = this.items
      .filter((item) => item.assignedCourierId?.toString() === courierId)
      .slice((page - 1) * 20, page * 20);

    return courierParcels;
  }

  async create(parcel: Parcel) {
    this.items.push(parcel);

    DomainEvents.dispatchEventsForAggregate(parcel.id);
  }

  async save(parcel: Parcel) {
    const itemIndex = this.items.findIndex((item) => item.id === parcel.id);

    if (itemIndex >= 0) {
      this.items[itemIndex] = parcel;
    }

    DomainEvents.dispatchEventsForAggregate(parcel.id);

    return parcel;
  }

  async delete(parcel: Parcel) {
    const itemIndex = this.items.findIndex((item) => item.id === parcel.id);

    this.items.splice(itemIndex, 1);
  }
}
