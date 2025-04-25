import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { combineLatest, Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit, OnDestroy {
  userId: number | undefined;
  user: User | undefined;
  private subscriptions: Subscription[] = [];
  /**
   *
   */
  constructor(
    private userService: UserService,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([this.auth.userId$]).subscribe(([uid]) => {
        if (uid) {
          this.getUserDetails(uid);
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getUserDetails(id: number) {
    this.userService.getUser(id).subscribe({
      next: (data) => {
        this.user = data;
      },
    });
  }
}
