import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SignUpDTO } from '../dtos/sign-up.dto';

@Injectable()
export class AuthAPI {
  private readonly ENDPOINT_URL = `${environment.apiUrl}sign-up`;

  constructor(private http: HttpClient) {}

  signUp(signupDTO: SignUpDTO) {
    return this.http.post(this.ENDPOINT_URL, signupDTO);
  }
}
