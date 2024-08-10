import { ErrorsConstants } from '../constants/errors';
import BaseResponse, { Message } from '../response/';

export default class InternalServerError extends BaseResponse {
  constructor(
    message: string | Record<string, unknown> = Message.INTERNAL_ERROR,
    status = ErrorsConstants.internal_error_status,
    code = ErrorsConstants.internal_error_code,
  ) {
    super();
    this.status = status;
    this.code = code;
    this.message = message;
  }
}
