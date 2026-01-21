import { BaseError } from "./base.error";

export class ValidationError extends BaseError {
  constructor(message: string, body?: unknown) {
    super(message, body);
    this.name = ValidationError.name;
    this.httpStatusCode = 422;
  }
}
