export default abstract class BaseResponse {
  protected message: string | Record<string, unknown> | undefined;
  protected status: number | undefined;
  protected code: string | undefined;
}

export class ErrorResponse extends BaseResponse {
  constructor(message: string, status: number, code: string) {
    super();
    this.message = message;
    this.status = status;
    this.code = code;
  }
}

export const Message = {
  INTERNAL_ERROR: 'Oops! It seems an error has occurred. Try again Later',
  HEALTH_CHECK_SUCCESS: 'Still in good condition!',
  WELCOME_MESSAGE: 'This is SolBet Backend',
  INVALID_ROUTE: 'Route not found!',
  INTERNAL_SERVER_ERROR: 'Internal Server',
  SECRET_REQUIRED: 'Invalid access key',
  PUBLIC_KEY_REQUIRED: 'Publickey is required',
  USER_NOT_FOUND: 'User not found',
  UNATHOURISED: "you are not authorised to view this ticket",
  TICKET_NOT_FOUND: "ticket not found",
  INVALID_AMOUNT: "invalid amount paid"
} as const;
