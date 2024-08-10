import { ErrorsConstants } from '../constants/errors';
import BaseResponse from '../response/';

export default class ConflictError extends BaseResponse {
  constructor(message: string | Record<string, unknown>) {
    super();
    this.status = ErrorsConstants.conflict_status;
    this.code = ErrorsConstants.conflict_code;
    this.message = message;
  }
}
