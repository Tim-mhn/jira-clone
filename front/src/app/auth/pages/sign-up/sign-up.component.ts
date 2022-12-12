import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthAPI } from '../../apis/auth.api';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(private authAPI: AuthAPI, private fb: FormBuilder) {}

  signupForm = this.fb.group({
    name: '',
    email: '',
    password: '',
  });

  ngOnInit(): void {}

  signUp() {
    this.authAPI.signUp(this.signupForm.value).subscribe(console.log);
  }
}
