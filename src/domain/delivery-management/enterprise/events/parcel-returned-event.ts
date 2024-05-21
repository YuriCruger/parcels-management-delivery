import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Parcel } from "../entities/parcel";

export class ParcelReturnedEvent implements DomainEvent {
  public ocurredAt: Date;
  public parcel: Parcel;

  constructor(parcel: Parcel) {
    this.parcel = parcel;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.parcel.id;
  }
}
