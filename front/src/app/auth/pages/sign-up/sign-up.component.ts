import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAPI } from '../../apis/auth.api';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private authAPI: AuthAPI,
    private fb: FormBuilder,
    private router: Router
  ) {}

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {}

  signUp() {
    if (this.signupForm.valid) {
      this.authAPI.signUp(this.signupForm.value).subscribe(() => {
        this.router.navigate(['auth', 'login']);
      });
    }
  }
}
