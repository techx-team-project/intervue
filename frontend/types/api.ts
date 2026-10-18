export type FieldError = {
  field?: string;
  message: string;
};

export type ApiErrorBody = {
  code: string;
  details: FieldError[];
  meta?: Record<string, unknown>;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiErrorBody | null;
  traceId: string | null;
  timestamp: string;
};

export type Page<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};
