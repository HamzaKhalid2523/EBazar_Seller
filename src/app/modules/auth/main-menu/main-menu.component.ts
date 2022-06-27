import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationRolesService } from 'src/app/core/services/api/operation-roles.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { ListingService } from 'src/app/core/services/helper/listings.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {

  statusColor = '#bebcbc';
  shopOption;

  formVisible = false;
  modalData;

  sellerVerificationVisible = false;

  constructor(
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = this.authService.getLoginData();
    if(user?.shop && user?.shop?.shopType === 'mart' && !user?.isVerified) {
      this.sellerVerificationVisible = true;
    }
  }

  selectShopType(type) {
    this.shopOption = type;
    this.formVisible = true;
  }

  mouseEnter(div: string) {
    this.statusColor = div;
  }
  mouseLeave(div: string) {
    this.statusColor = div;
  }

  enableSellerVerification() {
    this.formVisible = false;
    this.sellerVerificationVisible = true;
  }
}
