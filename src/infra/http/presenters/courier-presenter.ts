import { Courier } from "@/domain/delivery-management/enterprise/entities/courier";

export class CourierPresenter {
  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      name: courier.name,
      pin: courier.pin,
      password: courier.password,
      latitude: courier.latitude,
      longitude: courier.longitude,
      createdAt: courier.createdAt,
      updatedAt: courier.updatedAt,
    };
  }
}
