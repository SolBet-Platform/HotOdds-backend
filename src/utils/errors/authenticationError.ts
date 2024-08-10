import { ErrorsConstants } from '../constants/errors';
import BaseResponse from '../response/';

export default class AuthenticationError extends BaseResponse {
  constructor(message: string | Record<string, unknown>) {
    super();
    this.status = ErrorsConstants.authentication_status;
    this.code = ErrorsConstants.authentication_code;
    this.message = message;
  }
}
