import { HttpErrorResponse } from '@angular/common/http';

export type APIErrorBody = {
  Code: string;
  Message: string;
};

export class APIErrorResponse<
  ErrorType = APIErrorBody
> extends HttpErrorResponse {
  override error: ErrorType;
}
