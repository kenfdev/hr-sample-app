export class NotAuthorizedError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
}
