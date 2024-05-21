import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Courier,
  CourierProps,
} from "@/domain/delivery-management/enterprise/entities/courier";
import { faker } from "@faker-js/faker";

export function makeCourier(
  override: Partial<CourierProps> = {},
  id?: UniqueEntityID,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      pin: faker.string.numeric(11),
      latitude: faker.string.numeric(10),
      longitude: faker.string.numeric(10),
      ...override,
    },
    id,
  );

  return courier;
}
