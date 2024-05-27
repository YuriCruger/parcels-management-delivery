import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CourierProps {
  name: string;
  pin: string;
  password: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name;
  }

  get pin() {
    return this.props.pin;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
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
    props: Optional<CourierProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const courier = new Courier(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courier;
  }
}
