import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalProductsService } from 'src/app/core/services/api/localProducts.service';
import { MartProductsService } from 'src/app/core/services/api/martProducts.service';
import { OriginalShopsService } from 'src/app/core/services/api/originalShops.service';
import { AuthService } from 'src/app/core/services/helper/auth.service';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  selectedProductName;
  selectedProductBrand;
  search_string;

  dataList = [];
  dataTotalCount = 0;
  pageSize = 20;
  pageIndex = 1;
  dataLoading = false;

  formVisible = false;
  modalData;
  formType;

  filterDrawerVisible = true;
  filterDrawerPadding = true;
  topMenuStatus = false;

  currentUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private helplerService: HelperService,
    private martProductsService: MartProductsService,
    private localProductsService: LocalProductsService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Method Declarations
  ngOnInit() {
    this.currentUser = this.authService.getLoginData();
    this.topMenuListener();
    this.getAllData();
  }

  topMenuListener() {
    this.helplerService.getTopmenuStatus().subscribe(
      (response) => {
        this.topMenuStatus = response;
      }
    );
  }

  // Get All Users
  getAllData() {
    this.formVisible = false;
    this.dataLoading = true;
    let filterOptions = this.getQueryFilters();

    if(this.currentUser.shop?.shopType === 'mart') {
      this.martProductsService.getData(filterOptions).subscribe(
        (response) => {
          this.dataList = response?.data;
          this.dataTotalCount = response?.total;
          this.dataLoading = false;
        },
        (error) => {
          console.log("error", error);
          this.dataLoading = false;
        }
      );
    } else {
      this.localProductsService.getData(filterOptions).subscribe(
        (response) => {
          this.dataList = response?.data;
          this.dataTotalCount = response?.total;
          this.dataLoading = false;
        },
        (error) => {
          console.log("error", error);
          this.dataLoading = false;
        }
      );
    }
  }

  // Pagination Implementation
  pageSizeChanged(e) {
    this.pageSize = e;
    this.getAllData();
  }
  pageIndexChanged(e) {
    this.pageIndex = e;
    this.getAllData();
  }

  getQueryFilters() {
    const limit = this.pageSize;
    const skip = (this.pageIndex - 1) * this.pageSize;
    const sort = '-createdAt';

    let filters = [{ key: 'seller', value: this.currentUser?._id, operator: 'equals' }];
    let filterOptions = { filters, limit, skip, sort, isLogged: true };

    if (this.selectedProductName) {
      filterOptions?.filters.push({ key: 'productName', value: this.selectedProductName, operator: 'equals' });
    }
    if (this.selectedProductBrand) {
      filterOptions?.filters.push({ key: 'productBrand', value: this.selectedProductBrand, operator: 'equals' });
    }
    if (this.search_string) {
      filterOptions?.filters.push({ key: 'productName,productBrand,productTags,shortDescription,longDescription', value: this.search_string, operator: 'like' });
    }

    return filterOptions;
  }

  // Change User Status (Enable, Disable)
  changeStatus(object) {
    this.dataLoading = true;
    const data = {
      status: object["status"] ? false : true,
    };

    if(this.currentUser.shop?.shopType === 'mart') {
      this.martProductsService.updateData(object._id, data).subscribe(
          (response) => {
            const msg = response.message;
            this.showToast(msg, "success");

            this.getAllData();
            this.dataLoading = false;
          },
          (error) => {
            const errorMsg =
              error?._message ||
              error?.detail?._message ||
              error?.error?.message ||
              "Server Error";

            this.showToast(errorMsg, "error");
            this.dataLoading = false;
          }
        );
    } else {
      this.localProductsService.updateData(object._id, data).subscribe(
          (response) => {
            const msg = response.message;
            this.showToast(msg, "success");

            this.getAllData();
            this.dataLoading = false;
          },
          (error) => {
            const errorMsg =
              error?._message ||
              error?.detail?._message ||
              error?.error?.message ||
              "Server Error";

            this.showToast(errorMsg, "error");
            this.dataLoading = false;
          }
        );
    }
  }

  // Delete User
  deleteData(object) {
    this.dataLoading = true;

    if(this.currentUser.shop?.shopType === 'mart') {
      this.martProductsService.deleteData(object._id).subscribe(
        (response) => {
          this.showToast("Data Deteled Successfully", "success");
          this.getAllData();
          this.dataLoading = false;
        },
        (error) => {
          const errorMsg =
            error?.detail?._message ||
            error?.error?.message ||
            error?.error?.errmsg ||
            "Server Error";
          console.log("error", error, errorMsg);

          this.showToast(errorMsg, "error");
          this.dataLoading = false;
        }
      );
    } else {
      this.localProductsService.deleteData(object._id).subscribe(
        (response) => {
          this.showToast("Data Deteled Successfully", "success");
          this.getAllData();
          this.dataLoading = false;
        },
        (error) => {
          const errorMsg =
            error?.detail?._message ||
            error?.error?.message ||
            error?.error?.errmsg ||
            "Server Error";
          console.log("error", error, errorMsg);

          this.showToast(errorMsg, "error");
          this.dataLoading = false;
        }
      );
    }
  }

  // Actions/Users Filters Applied
  statusSelected() {
    this.pageIndex = 1;
    this.getAllData();
  }

  showCreateModal() {
    this.router.navigateByUrl('/pages/add-product');
  }
  showEditModal(data) {
    this.router.navigateByUrl(`/pages/${data?._id}/add-product`);
  }

  toggleFilterDrawer() {
    this.filterDrawerVisible = !this.filterDrawerVisible;
    if(this.filterDrawerVisible) {
      this.filterDrawerPadding = true;
    } else {
      setTimeout(() => {
        this.filterDrawerPadding = false;
      }, 800);
    }
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
