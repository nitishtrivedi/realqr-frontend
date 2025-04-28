import { Routes } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ManageEnquiryComponent } from './components/manage-enquiry/manage-enquiry.component';
import { AdminComponent } from './components/admin/admin.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AdminGuard } from './admin.guard';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditEnquiryComponent } from './components/edit-enquiry/edit-enquiry.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';

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
    path: 'manage-profile/:id',
    component: ManageProfileComponent,
    canActivate: [AuthGuard],
  },
  // ADMIN ROUTES
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/add-user',
    component: AddUserComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/edit-user/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/edit-enquiry/:id',
    component: EditEnquiryComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];
