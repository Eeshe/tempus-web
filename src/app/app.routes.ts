import { Routes } from '@angular/router';
import { LoginForm } from './auth/login-form/login-form';
import { RegisterForm } from './auth/register-form/register-form';
import { ClientsPage } from './client/clients-page/clients-page';
import { authGuard } from './guards/auth.guard';
import { Home } from './home/home';
import { ProjectsPage } from './project/projects-page/projects-page';
import { ReportsPage } from './reports/reports-page/reports-page';

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
    title: "Home",
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: "reports",
    title: "Reports",
    component: ReportsPage,
    canActivate: [authGuard],
  },
  {
    path: "projects",
    title: "Projects",
    component: ProjectsPage,
    canActivate: [authGuard],
  },
  {
    path: "clients",
    title: "Clients",
    component: ClientsPage,
    canActivate: [authGuard],
  }
];
