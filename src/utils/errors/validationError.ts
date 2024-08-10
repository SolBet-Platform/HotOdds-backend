import { ErrorsConstants } from '../constants/errors';
import BaseResponse from '../response/';

export default class ValidationError extends BaseResponse {
  constructor(
    message: string | Record<string, unknown>,
    code = ErrorsConstants.validation_code,
  ) {
    super();
    this.status = ErrorsConstants.validation_status;
    this.code = code;
    this.message = message;
  }
}
