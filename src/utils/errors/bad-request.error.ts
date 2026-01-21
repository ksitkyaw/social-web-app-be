import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
  constructor(message = "Bad request", body?: unknown) {
    super(message, body);
    this.name = BadRequestError.name;
    this.httpStatusCode = 400;
  }
}
