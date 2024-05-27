import { UseCaseError } from "@/core/errors/use-case-error";

export class CourierAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`The pin provided is already in use by another user`);
  }
}
