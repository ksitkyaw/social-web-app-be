import { BaseError } from "./base.error";

export class AuthenticationError extends BaseError {
  constructor(message = "Authentication required", body?: unknown) {
    super(message, body);
    this.name = AuthenticationError.name;
    this.httpStatusCode = 401;
  }
}
