interface Error {
  message: string;
  statusCode: number;
}

export interface ErrorsType {
  [key: string]: Error;
}
