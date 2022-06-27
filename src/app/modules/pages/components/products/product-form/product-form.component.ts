import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FirebaseImageHandler } from 'src/app/core/services/api/firebase-image-handler.service';
import { LocalProductsService } from 'src/app/core/services/api/localProducts.service';
import { MartProductsService } from 'src/app/core/services/api/martProducts.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { ListingService } from 'src/app/core/services/helper/listings.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  referenceObj: any;
  productLoading = false;
  formType = "Create";
  topMenuStatus = false;
  productCategoriesVisible = false;

  tags = [];
  features = [];
  editorConfig = {};
  colorsList = [];
  warrantyTypeList = ['Brand Warranty','Local Warranty','No Warranty'];

  tagsIndex = 0;
  featuresIndex = 0;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private helplerService: HelperService,
    private martProductsService: MartProductsService,
    private localProductsService: LocalProductsService,
    private firebaseImageHandler: FirebaseImageHandler,
    private listingService: ListingService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.formType = data?.formType || 'Create';
      this.colorsList = this.listingService.colors;
      this.editorConfig = this.listingService.editorConfig;
      this.createForm();
      this.initializeForm();
      this.topMenuListener();
    });
  }

  topMenuListener() {
    this.helplerService.getTopmenuStatus().subscribe(
      (response) => {
        this.topMenuStatus = response;
      }
    );
  }

  createForm() {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(5)]],
      productBrand: ['', [Validators.required, Validators.minLength(5)]],
      productCategoriesLabel: [ '', [Validators.required]],
      productCategories: [ [], [Validators.required]],
      productFeatures: [ [], [Validators.required]],
      productTags: [ [], [Validators.required]],
      shortDescription: [ '', [Validators.required, Validators.minLength(5)]],
      longDescription: [ '', [Validators.required, Validators.minLength(5)]],
      color: [ '', [Validators.required]],
      price: [ 0, [Validators.required]],
      weight: [ 0, [Validators.required]],
      warrantyType: [ '', [Validators.required]],
      productImages: [[], []],
      status: [true, [Validators.required]],
      deliveryPrice: [ 0, [Validators.required]],
      stockQuantity: [ 0, [Validators.required]],
    });
  }

  initializeForm() {
    if(this.formType === 'Create') return;
    else if(this.formType === 'Update') {
      this.productForm.reset();
      this.createReference(this.productForm.value);
    }
  }

  categoriesSelected(data) {
    this.productForm.patchValue({productCategoriesLabel: data.join(' > ')});
    this.productForm.patchValue({productCategories: data});
    this.productCategoriesVisible = false;
  }

  onImagePicked(imageData: any) {
    const files = [];
    var filesAmount = imageData.length;
    for (let i = 0; i < filesAmount; i++) {
      files.push(imageData[i]);
    }
    this.productForm.patchValue({ productImages: files });
  }

  removeImage(index) {
    const files = this.productForm.get('companyDocs').value;
    files.splice(index, 1);
    this.productForm.patchValue({ companyDocs: files });
  }

  addTagItem(input: HTMLInputElement): void {
    const value = input.value;
    if (this.tags.indexOf(value) === -1) {
      this.tags = [...this.tags, input.value || `New item ${this.tagsIndex++}`];
    }
  }

  addFeatureItem(input: HTMLInputElement): void {
    const value = input.value;
    if (this.features.indexOf(value) === -1) {
      this.features = [...this.features, input.value || `New item ${this.featuresIndex++}`];
    }
  }

  submitForm() {
    if (!this.productForm.valid) return;
    const value = this.productForm.value;
    delete value['productCategoriesLabel'];

    const user = this.authService.getLoginData();
    value.shop = user.shop?.martShop || user.shop?.localShop;
    value.seller = user._id;

    if(user.shop?.shopType === 'mart') {
      if(this.formType === "Update") this.updateData(value);
      else if(this.formType === "Create") this.saveMartData(value);
    } else {
      if(this.formType === "Update") this.updateData(value);
      else if(this.formType === "Create") this.saveLocalData(value);
    }
  }

  // Udate User
  updateData(object) {
  //   this.userLoading = true;
  //   const data = this.helplerService.getChangedObj(this.referenceObj, object);

  //   this.originalShopsService.updateData(this.updatedData["_id"], data)
  //   .subscribe(
  //     (response) => {
  //       const msg = response.message;
  //       this.showToast(msg, "success");
  //       this.modalVisible.emit();
  //     },
  //     (error) => {
  //       let errorMsg;
  //       if (error?.status === 422 || error?.error?.code === 422) {
  //         errorMsg = "No Field to be Updated!";
  //       } else {
  //         errorMsg = error?._message || error?.detail?._message ||
  //                   error?.error?.message || "Something Went Wrong. Server Error!!";
  //       }
  //       this.showToast(errorMsg, "error");
  //       this.productLoading = false;
  //     }
  //   );
  }

  async saveMartData(object) {
    this.productLoading = true;
    const uploadImgObs = combineLatest(await this.firebaseImageHandler.uploadMartShopsDocs(
      this.productForm.value.productImages,
      'originalMartShops'
    ));
    uploadImgObs.subscribe(async (imgUrls) => {
      this.martProductsService.createData(object, imgUrls).subscribe(
        (response) => {
          if (response?.detail?.code === 11000 || response?.message === "Error") {
            const errorMsg = response?.message || response?.detail?._message || response?.error?.message ||
                            response?.message || "Something Went Wrong. Server Error!!";
            this.showToast(errorMsg, "error");
            this.productLoading = false;
          } else {
            const msg = response.message;
            this.showToast(msg, "success");
            this.productLoading = false;
            this.productForm.reset();
            this.router.navigateByUrl('products');
          }
        },
        (error) => {
          imgUrls.forEach(img => {
            this.firebaseImageHandler.deleteImage(img);
          });
          const errorMsg = error?.message || error?._message || error?.detail?._message ||
                          error?.error?.message || "Something Went Wrong. Server Error!!";
          this.showToast(errorMsg, "error");
          this.productLoading = false;
        }
      );
    });
  }

  async saveLocalData(object) {
    this.productLoading = true;
    const uploadImgObs = combineLatest(await this.firebaseImageHandler.uploadMartShopsDocs(
      this.productForm.value.productImages,
      'originalMartShops'
    ));
    uploadImgObs.subscribe(async (imgUrls) => {
      this.localProductsService.createData(object, imgUrls).subscribe(
        (response) => {
          if (response?.detail?.code === 11000 || response?.message === "Error") {
            const errorMsg = response?.message || response?.detail?._message || response?.error?.message ||
                            response?.message || "Something Went Wrong. Server Error!!";
            this.showToast(errorMsg, "error");
            this.productLoading = false;
          } else {
            const msg = response.message;
            this.showToast(msg, "success");
            this.productLoading = false;
            this.productForm.reset();
            this.router.navigateByUrl('products');
          }
        },
        (error) => {
          imgUrls.forEach(img => {
            this.firebaseImageHandler.deleteImage(img);
          });
          const errorMsg = error?.message || error?._message || error?.detail?._message ||
                          error?.error?.message || "Something Went Wrong. Server Error!!";
          this.showToast(errorMsg, "error");
          this.productLoading = false;
        }
      );
    });
  }

  createReference(obj: any) {
    this.referenceObj = Object.assign({}, obj);
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
