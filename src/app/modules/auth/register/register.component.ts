import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellersService } from 'src/app/core/services/api/sellers.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService,
    private router: Router,
    private sellersService: SellersService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.minLength(4), Validators.email]],
      phone: [ null, [ Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      address: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    for (const i in this.signupForm.controls) {
      if (i) {
        this.signupForm.controls[i].markAsDirty();
        this.signupForm.controls[i].updateValueAndValidity();
      }
    }
  }

  login() {
    this.submitForm();
    if (this.signupForm.valid) {
      this.loading = true;

      this.sellersService.signupUser(this.signupForm.value).subscribe(
        (response) => {
          const tokenData = response.token;
          this.authService.saveLoginToken(tokenData);
          this.authService.saveLoginData(response.user);

          this.loading = false;
          this.helperService.showToast("Log in successfully");
          this.router.navigateByUrl("/main-menu");
        },
        (error) => {
          const errorMsg =
            error?.error.Error ||
            error?.detail?._message ||
            error?.error?.message ||
            error?.error?.errmsg ||
            "Something Went Wrong. Server Error!!";
          console.log("error", error, errorMsg);
          0;

          this.helperService.showToast(errorMsg, "error");

          this.loading = false;
        }
      );
    }
  }
}
