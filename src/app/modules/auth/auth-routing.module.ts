import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageGuard } from 'src/app/core/guards/mainPage.guard';
import { RedirectLoginGuard } from 'src/app/core/guards/redirectlogin.guard';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        canActivate: [RedirectLoginGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [RedirectLoginGuard],
      },
      {
        path: 'main-menu',
        component: MainMenuComponent,
        canActivate: [MainPageGuard],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
