export interface LeagueResponse {
  get: string;
  parameters: {
    id: string;
  };
  errors: Array<unknown>;
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Record<string, never>[];
}
