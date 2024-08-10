import { ErrorsConstants } from '../constants/errors';
import BaseResponse from '../response/';

export default class AuthorizationError extends BaseResponse {
  constructor(message: string | Record<string, unknown>) {
    super();
    this.status = ErrorsConstants.authorization_status;
    this.code = ErrorsConstants.authorization_code;
    this.message = message;
  }
}
