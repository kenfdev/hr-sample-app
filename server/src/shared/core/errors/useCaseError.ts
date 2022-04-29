export abstract class UseCaseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UseCaseError.prototype);
  }
}
