export class ReturnApiType<T> {
  status: number;
  message: string;
  data: T;
  total?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
}
