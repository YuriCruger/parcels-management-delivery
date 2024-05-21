import { CouriersRepository } from "@/domain/delivery-management/application/repositories/couriers-repository";
import { Courier } from "@/domain/delivery-management/enterprise/entities/courier";

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = [];

  async findById(id: string) {
    const courier = this.items.find((item) => item.id.toString() === id);

    if (!courier) {
      return null;
    }

    return courier;
  }

  async create(courier: Courier) {
    this.items.push(courier);
  }

  async delete(courier: Courier) {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id);

    this.items.splice(itemIndex, 1);
  }
}
