export class APIError extends Error {
  public statusCode;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}
