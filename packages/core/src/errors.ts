export class ModulynError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(
    code: string,
    message: string,
    statusCode = 500
  ) {
    super(message);

    this.name = "ModulynError";
    this.code = code;
    this.statusCode = statusCode;
  }
}