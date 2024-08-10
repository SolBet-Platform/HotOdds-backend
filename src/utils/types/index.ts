export interface ApiResponse<T> {
  message?: string;
  status?: number | ((code: number) => this);
  data?: T;
}
