import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, NgIf, MatMenuModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  isUserAdmin: boolean = false;
  user: User | undefined;
  userFullname: string = '';

  routerLinkHeader: string = '';
  isMainForm: boolean = false;
  private authSubscription: Subscription | undefined;
  /**
   *
   */
  constructor(
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.checkAuthStatus();
    this.authSubscription = this.auth.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      this.routerLinkHeader = isAuth ? '/dashboard' : '';
      if (isAuth) {
        const token = sessionStorage.getItem('userToken');
        if (token) {
          const userId = this.auth.getUserIdFromToken(token);
          if (userId) {
            this.getUserById(userId);
          } else {
            this.userFullname = '';
            this.user = undefined;
          }
        }
      } else {
        this.userFullname = '';
        this.user = undefined;
      }
    });
    this.checkIfMainForm();
    this.router.events.subscribe(() => {
      this.checkIfMainForm();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkIfMainForm() {
    // Adjust the route path to match your main form route (e.g., '/form', '/enquiry')
    this.isMainForm = this.router.url === '';
  }

  private getUserById(userId: string) {
    const numUID: number = parseInt(userId);
    this.userService.getUser(numUID).subscribe({
      next: (data) => {
        this.user = data;
        this.userFullname = `${data.firstName} ${data.lastName}`;
        this.isUserAdmin = data.isUserAdmin;
      },
    });
  }
  logout() {
    this.auth.logout();
  }
}
