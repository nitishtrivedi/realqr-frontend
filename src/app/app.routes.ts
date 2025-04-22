import { Routes } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ManageEnquiryComponent } from './components/manage-enquiry/manage-enquiry.component';
import { AdminComponent } from './components/admin/admin.component';

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
  {
    path: 'manage-enquiry/:id',
    component: ManageEnquiryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
];
