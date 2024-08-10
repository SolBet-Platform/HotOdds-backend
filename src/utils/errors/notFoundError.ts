import { ErrorsConstants } from '../constants/errors';
import BaseResponse from '../response/';

export default class NotFoundError extends BaseResponse {
  constructor(message: string | Record<string, unknown>) {
    super();
    this.message = message;
    this.status = ErrorsConstants.notFound_status;
    this.code = ErrorsConstants.notFound_code;
  }
}
