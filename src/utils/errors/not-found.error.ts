import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
  constructor(message = "Resource not found", body?: unknown) {
    super(message, body);
    this.name = NotFoundError.name;
    this.httpStatusCode = 404;
  }
}
