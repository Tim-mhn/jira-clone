import { HttpErrorResponse } from '@angular/common/http';

export type APIErrorResponse = {
  Code: string;
  Message: string;
};

export class MyHttpErrorResponse<ErrorType = Error> extends HttpErrorResponse {
  override error: ErrorType;
}
