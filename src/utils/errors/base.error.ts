export class BaseError extends Error {
  public name: string;

  public httpStatusCode: number;

  public message: string;

  public body?: unknown;

  constructor(message: string, body?: unknown) {
    super(message);
    this.name = BaseError.name;
    this.httpStatusCode = 500;
    this.message = message;
    this.body = body;
  }
}
