import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ListingService } from 'src/app/core/services/helper/listings.service';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent implements OnInit {

  selectedCategories = [];
  categoriesList = [];
  firstList = [];
  secondList = [];
  thirdList = [];

  selectedLevel = 0;
  confirmEnable = false;

  @Output() modalVisible = new EventEmitter<any>();
  @Output() categoriesSelected = new EventEmitter<any>();

  constructor(
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    this.categoriesList = this.listingService.productCategories;
    this.firstList = this.categoriesList;
  }

  itemClicked(data) {
    this.selectedLevel = data.level;

    if(data.level === 1) {
      this.thirdList = [];
      this.secondList = data.children;
      this.selectedCategories = [data.name];
      this.confirmEnable = false;
    } else if(data.level === 2) {
      this.selectedCategories = [this.selectedCategories[0],data.name];
      this.confirmEnable = data.parent ? false : true;

      if(data.parent) this.thirdList = data.children;
      else this.thirdList = [];
      console.log(this.thirdList);
    } else if(data.level === 3) {
      this.selectedCategories = [this.selectedCategories[0],this.selectedCategories[1],data.name];
      this.confirmEnable = data.parent ? false : true;
    }
  }

  cancel() {
    this.modalVisible.emit();
  }
  clear() {
    this.firstList = this.categoriesList;
    this.secondList = [];
    this.thirdList = [];
    this.selectedCategories = [];

    this.selectedLevel = 0;
    this.confirmEnable = false;
  }
  confirm() {
    this.categoriesSelected.emit(this.selectedCategories);
  }
}
