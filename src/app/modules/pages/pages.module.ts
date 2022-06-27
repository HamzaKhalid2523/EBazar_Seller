import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from '../pages/pages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddAdminComponent } from './components/admin/add-admin/add-admin.component';
import { OriginalShopsComponent } from './components/original-shops/original-shops.component';
import { AddOriginalShopComponent } from './components/original-shops/add-original-shop/add-original-shop.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { ProductCategoriesComponent } from './components/products/product-form/product-categories/product-categories.component';
import { OrdersComponent } from './components/orders/orders.component';

const components = [
  PagesComponent, DashboardComponent, AdminComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,

  ],
  declarations: [...components, AddAdminComponent, OriginalShopsComponent, AddOriginalShopComponent, ProductsComponent, ProductFormComponent, ProductCategoriesComponent, OrdersComponent],
  providers: []
})
export class PagesModule { }
