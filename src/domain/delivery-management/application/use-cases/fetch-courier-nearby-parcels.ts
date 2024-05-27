import { Either, right } from "@/core/either";
import { Parcel } from "../../enterprise/entities/parcel";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { RecipientsRepository } from "../repositories/recipients-repository";
import { Injectable } from "@nestjs/common";

interface FetchCourierNearbyParcelsUseCaseRequest {
  courierId: string;
  courierLatitude: number;
  courierLongitude: number;
  page: number;
}

type FetchCourierNearbyParcelsUseCaseResponse = Either<
  null,
  { courierNearbyParcels: Parcel[] }
>;

@Injectable()
export class FetchCourierNearbyParcelsUseCase {
  constructor(
    private parcelsRepository: ParcelsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    courierId,
    courierLatitude,
    courierLongitude,
    page,
  }: FetchCourierNearbyParcelsUseCaseRequest): Promise<FetchCourierNearbyParcelsUseCaseResponse> {
    const nearbyRecipients = await this.recipientsRepository.findManyNearBy({
      latitude: courierLatitude,
      longitude: courierLongitude,
    });

    const courierParcels = await this.parcelsRepository.findManyByCourierId(
      courierId,
      {
        page,
      },
    );

    const courierNearbyParcels = courierParcels.filter((parcel) => {
      return nearbyRecipients.some((recipient) => {
        return recipient.id.toString() === parcel.recipientId.toString();
      });
    });

    return right({ courierNearbyParcels });
  }
}
