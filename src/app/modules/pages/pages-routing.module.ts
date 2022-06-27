import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { isLoginGuard } from 'src/app/core/guards/islogin.guard';
import { AdminComponent } from './components/admin/admin.component';
import { OriginalShopsComponent } from './components/original-shops/original-shops.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [isLoginGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
        },
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
        },
      },
      {
        path: 'add-product',
        component: ProductFormComponent,
        data: {
          formType: 'Create'
        },
      },
      {
        path: ':id/update-product',
        component: ProductFormComponent,
        data: {
          formType: 'Update'
        },
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
        },
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
