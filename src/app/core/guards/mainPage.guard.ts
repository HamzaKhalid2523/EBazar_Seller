import { CanActivate, Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { AuthService } from '../services/helper/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MainPageGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    const user = this.authService.getLoginData();
    if(user) {
      if(!user?.shop || (user?.shop && user?.shop?.shopType === 'mart' && !user?.isVerified)) {
        return true;
      } else {
        this.router.navigateByUrl('/pages');
      }
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }
}
