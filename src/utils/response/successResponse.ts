import BaseResponse from './index';
import { STANDARD } from '../constants';

export default class SuccessResponse<T> extends BaseResponse {
  private data: T;
  constructor(
    message: string | Record<string, unknown>,
    status = STANDARD.SUCCESS,
    data: T = undefined,
  ) {
    super();
    this.status = status;
    this.code = 'Success';
    this.message = message;
    this.data = data;
  }
}
