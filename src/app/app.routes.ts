import { Routes } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: FormComponent },
  { path: 'form', component: FormComponent },
  { path: 'login', component: LoginComponent },

  //Add more routes in the below given format so that unauthorised access is not allowed
  //{ path: 'protected-route', component: SomeComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];
