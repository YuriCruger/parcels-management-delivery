import { Parcel } from "@/domain/delivery-management/enterprise/entities/parcel";

export class ParcelPresenter {
  static toHTTP(Parcel: Parcel) {
    return {
      id: Parcel.id.toString(),
      recipientId: Parcel.recipientId.toString(),
      status: Parcel.status,
      url: Parcel.url,
      assignedCourierId: Parcel.assignedCourierId.toString(),
    };
  }
}
