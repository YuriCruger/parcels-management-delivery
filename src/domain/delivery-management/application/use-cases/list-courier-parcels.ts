import { Either, right } from "@/core/either";
import { Parcel } from "../../enterprise/entities/parcel";
import { ParcelsRepository } from "../repositories/parcels-repository";
import { Injectable } from "@nestjs/common";

interface ListCourierParcelsUseCaseRequest {
  courierId: string;
  page: number;
}

type ListCourierParcelsUseCaseResponse = Either<
  null,
  { courierParcels: Parcel[] }
>;

@Injectable()
export class ListCourierParcelsUseCase {
  constructor(private parcelsRepository: ParcelsRepository) {}

  async execute({
    courierId,
    page,
  }: ListCourierParcelsUseCaseRequest): Promise<ListCourierParcelsUseCaseResponse> {
    const courierParcels = await this.parcelsRepository.findManyByCourierId(
      courierId,
      {
        page,
      },
    );

    return right({ courierParcels });
  }
}
