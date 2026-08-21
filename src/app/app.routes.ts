import { Routes } from '@angular/router';
import { RegisterForm } from './register-form/register-form';
import { LoginForm } from './login-form/login-form';
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
