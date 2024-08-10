export default abstract class BaseResponse {
  protected message: string | Record<string, unknown> | undefined;
  protected status: number | undefined;
  protected code: string | undefined;
}

export const Message = {
  INTERNAL_ERROR: 'Oops! It seems an error has occurred. Try again Later',
  HEALTH_CHECK_SUCCESS: 'Still in good condition!',
  WELCOME_MESSAGE: 'This is SolBet Backend',
  INVALID_ROUTE: 'Route not found!',
  INTERNAL_SERVER_ERROR: 'Internal Server',
} as const;
