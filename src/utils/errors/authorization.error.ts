import { BaseError } from "./base.error";

export class AuthorizationError extends BaseError {
  constructor(message = "You are not allowed to perform this action", body?: unknown) {
    super(message, body);
    this.name = AuthorizationError.name;
    this.httpStatusCode = 403;
  }
}
