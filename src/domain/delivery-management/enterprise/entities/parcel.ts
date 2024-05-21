import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ParcelCreatedEvent } from "../events/parcel-created-event";
import { ParcelInTransitEvent } from "../events/parcel-in-transit-event";
import { ParcelDeliveredEvent } from "../events/parcel-delivered-event";
import { ParcelReturnedEvent } from "../events/parcel-returned-event";

export enum ParcelStatus {
  AwaitingPickup = "awaiting_pickup",
  InTransit = "in_transit",
  Delivered = "delivered",
  Returned = "returned",
}

export interface ParcelProps {
  assignedCourierId: UniqueEntityID | null;
  recipientId: UniqueEntityID;
  status: ParcelStatus;
  url?: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Parcel extends AggregateRoot<ParcelProps> {
  get assignedCourierId() {
    return this.props.assignedCourierId;
  }

  set assignedCourierId(courierId: UniqueEntityID | null) {
    this.props.assignedCourierId = courierId;
    this.touch();
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get status() {
    return this.props.status;
  }

  set status(status: ParcelStatus) {
    if (status === ParcelStatus.Delivered && !this.props.url) {
      return;
    }

    if (status === ParcelStatus.InTransit) {
      this.addDomainEvent(new ParcelInTransitEvent(this));
    }

    if (status === ParcelStatus.Delivered) {
      this.addDomainEvent(new ParcelDeliveredEvent(this));
    }

    if (status === ParcelStatus.Returned) {
      this.addDomainEvent(new ParcelReturnedEvent(this));
    }

    this.props.status = status;
    this.touch();
  }

  get url() {
    return this.props.url;
  }

  set url(url: string | undefined) {
    this.props.url = url;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: ParcelProps, id?: UniqueEntityID) {
    const parcel = new Parcel(
      {
        ...props,
        assignedCourierId: props.assignedCourierId ?? null,
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      parcel.addDomainEvent(new ParcelCreatedEvent(parcel));
    }

    return parcel;
  }
}
