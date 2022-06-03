
export class BaseError extends Error {
  constructor (
    errMessage: string,
    public readonly code: number = -1,
  ) {
    super(errMessage);
  }
}
