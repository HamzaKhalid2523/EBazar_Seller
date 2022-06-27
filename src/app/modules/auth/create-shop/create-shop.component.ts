import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FirebaseImageHandler } from 'src/app/core/services/api/firebase-image-handler.service';
import { LocalShopsService } from 'src/app/core/services/api/localShops.service';
import { MartShopsService } from 'src/app/core/services/api/martShops.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit {

  @Input() shopType;
  @Output() modalVisible = new EventEmitter<any>();

  loading = false;
  shopForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private helplerService: HelperService,
    private firebaseImageHandler: FirebaseImageHandler,
    private localShops: LocalShopsService,
    private martShops: MartShopsService,
    private router: Router,
    private authSerice: AuthService
  ) { }

  ngOnInit(): void {
    this.shopForm = this.fb.group({
      companyName: [null, [Validators.required]],
      companyAddress: [null, [Validators.required]],
      companyDocs: [null, [Validators.required]],
      companyLogo: [null, []]
    });
  }

  onImagePicked(imageData: any) {
    const files = [];
    var filesAmount = imageData.length;
    for (let i = 0; i < filesAmount; i++) {
      console.log(imageData[i]);
      files.push(imageData[i]);
    }
    this.shopForm.patchValue({ companyDocs: files });
  }

  onLogoPicked(imageData: File) {
    console.log(imageData);
    this.shopForm.patchValue({ companyLogo: imageData });
  }

  removeImage(index) {
    const files = this.shopForm.get('companyDocs').value;
    files.splice(index, 1);
    this.shopForm.patchValue({ companyDocs: files });
  }

  // Add User
  async saveData() {
    if (!this.shopForm.valid) return;

    this.loading = true;
    const object = this.shopForm.value;

    const uploadDocsObs = combineLatest(await this.firebaseImageHandler.uploadMartShopsDocs(
      this.shopForm.value.companyDocs,
      this.shopType === "local" ? 'localShop' : 'martShop'
    ));

    uploadDocsObs.subscribe(async (imgUrls) => {
      if(this.shopForm.value.companyLogo) {
        const uploadLogoObs = combineLatest(await this.firebaseImageHandler.uploadMartShopsDocs(
          this.shopForm.value.companyLogo,
          this.shopType === "local" ? 'localShop' : 'martShop'
        ));
        uploadLogoObs.subscribe(async (imgUrl) => {
          if(this.shopType === "local") this.saveLocalShop(object, imgUrls, imgUrl[0]);
          else if(this.shopType === "mart") this.saveMartShop(object, imgUrls, imgUrl[0]);
        });
      } else {
        if(this.shopType === "local") this.saveLocalShop(object, imgUrls, '');
        else if(this.shopType === "mart") this.saveMartShop(object, imgUrls, '');
      }
    });
  }

  saveLocalShop(object, urls, logo) {
    this.localShops.createData(object, urls, logo).subscribe(
      (response) => {
        if (response?.detail?.code === 11000 || response?.message === "Error") {
          const errorMsg = response?.message || response?.detail?._message || response?.error?.message ||
                          response?.message || "Something Went Wrong. Server Error!!";
          this.showToast(errorMsg, "error");
          this.loading = false;
        } else {
          const msg = response.message;
          this.showToast(msg, "success");
          this.loading = false;
          this.router.navigateByUrl('/pages');
        }
      },
      (error) => {
        urls.forEach(img => {
          this.firebaseImageHandler.deleteImage(img);
        });
        const errorMsg = error?.message || error?._message || error?.detail?._message ||
                        error?.error?.message || "Something Went Wrong. Server Error!!";
        this.showToast(errorMsg, "error");
        this.loading = false;
      }
    );
  }

  saveMartShop(object, urls, logo) {
    this.martShops.createData(object, urls, logo).subscribe(
      (response) => {
        if (response?.detail?.code === 11000 || response?.message === "Error") {
          const errorMsg = response?.message || response?.detail?._message || response?.error?.message ||
                          response?.message || "Something Went Wrong. Server Error!!";
          this.showToast(errorMsg, "error");
          this.loading = false;
        } else {
          const seller = response.seller;
          this.authSerice.saveLoginData(seller);
          const msg = response.message;
          this.showToast(msg, "success");
          this.loading = false;
          this.modalVisible.emit();
        }
      },
      (error) => {
        urls.forEach(img => {
          this.firebaseImageHandler.deleteImage(img);
        });
        const errorMsg = error?.message || error?._message || error?.detail?._message ||
                        error?.error?.message || "Something Went Wrong. Server Error!!";
        this.showToast(errorMsg, "error");
        this.loading = false;
      }
    );
  }

  // Show Toaster
  showToast(msg, status = "success") {
    if (status == "success") {
      this.helplerService.showToast(msg, "success");
    } else {
      this.helplerService.showToast(msg, "error");
    }
  }
}
