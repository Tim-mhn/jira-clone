import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginDTO } from '../dtos/login.dto';
import { SignUpDTO } from '../dtos/sign-up.dto';
import { UserDTO } from '../dtos/user.dto';

@Injectable()
export class AuthAPI {
  private readonly SIGN_UP_ENDPOINT = `${environment.apiUrl}sign-up`;
  private readonly LOGIN_ENDPOINT = `${environment.apiUrl}sign-in`;
  private readonly ME_ENDPOINT = `${environment.apiUrl}me`;

  constructor(private http: HttpClient) {}

  signUp(signupDTO: SignUpDTO) {
    return this.http.post(this.SIGN_UP_ENDPOINT, signupDTO);
  }

  login(loginDTO: LoginDTO) {
    return this.http.post(this.LOGIN_ENDPOINT, loginDTO);
  }

  me() {
    return this.http.get<UserDTO>(this.ME_ENDPOINT);
  }
}
