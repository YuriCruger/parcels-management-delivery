import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CourierProps {
  name: string;
  pin: string;
  latitude: string;
  longitude: string;
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name;
  }

  get pin() {
    return this.props.pin;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  static create(props: CourierProps, id?: UniqueEntityID) {
    const courier = new Courier(props, id);

    return courier;
  }
}
