import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ParcelCreatedEvent } from "../events/parcel-created-event";
import { ParcelInTransitEvent } from "../events/parcel-in-transit-event";
import { ParcelDeliveredEvent } from "../events/parcel-delivered-event";
import { ParcelReturnedEvent } from "../events/parcel-returned-event";
import { Optional } from "@/core/types/optional";

export enum ParcelStatus {
  AWAITING_PICKUP = "AWAITING_PICKUP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
}

export interface ParcelProps {
  assignedCourierId?: UniqueEntityID | null;
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
    if (status === ParcelStatus.DELIVERED && !this.props.url) {
      return;
    }

    if (status === ParcelStatus.IN_TRANSIT) {
      this.addDomainEvent(new ParcelInTransitEvent(this));
    }

    if (status === ParcelStatus.DELIVERED) {
      this.addDomainEvent(new ParcelDeliveredEvent(this));
    }

    if (status === ParcelStatus.RETURNED) {
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

  static create(
    props: Optional<ParcelProps, "createdAt" | "assignedCourierId">,
    id?: UniqueEntityID,
  ) {
    const parcel = new Parcel(
      {
        ...props,
        assignedCourierId: props.assignedCourierId ?? null,
        createdAt: props.createdAt ?? new Date(),
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
