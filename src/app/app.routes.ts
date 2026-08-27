import { Routes } from '@angular/router';
import { LoginForm } from './auth/login-form/login-form';
import { RegisterForm } from './auth/register-form/register-form';
import { authGuard } from './guards/auth.guard';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  {
    path: "register",
    title: "Register",
    component: RegisterForm,
  },
  {
    path: "login",
    title: "Login",
    component: LoginForm,
  },
  {
    path: "home",
    title: "home",
    component: Home,
    canActivate: [authGuard],
  }
];
