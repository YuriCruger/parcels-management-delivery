import { Either, right } from "@/core/either";
import { Parcel } from "../../enterprise/entities/parcel";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { RecipientRepository } from "../repositories/recipient-repository";

interface FetchParcelsUseCaseRequest {
  courierId: string;
  courierLatitude: number;
  courierLongitude: number;
  page: number;
}

type FetchParcelsUseCaseResponse = Either<null, { courierParcels: Parcel[] }>;

export class FetchParcelsUseCase {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    courierId,
    courierLatitude,
    courierLongitude,
    page,
  }: FetchParcelsUseCaseRequest): Promise<FetchParcelsUseCaseResponse> {
    const nearbyRecipients = await this.recipientRepository.findManyNearBy({
      latitude: courierLatitude,
      longitude: courierLongitude,
    });

    const courierParcels = await this.parcelsRepository.findManyByCourierId(
      courierId,
      {
        page,
      },
    );

    const parcelsNearCourier = courierParcels.filter((parcel) => {
      return nearbyRecipients.some((recipient) => {
        return recipient.id.toString() === parcel.recipientId.toString();
      });
    });

    return right({ courierParcels: parcelsNearCourier });
  }
}
