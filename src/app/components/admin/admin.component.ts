import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { combineLatest, Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Enquiry } from '../../models/EnquiryModel';
import { FormService } from '../../services/form.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('userPaginatorRef') userPaginator!: MatPaginator;
  @ViewChild('enqPaginatorRef') enqPaginator!: MatPaginator;

  users: User[] = [];
  userColumns: string[] = [
    'count',
    'userId',
    'userName',
    'fullName',
    'email',
    'isAdmin',
    'actions',
  ];
  userId: number | undefined;
  isUserAdmin: boolean = false;
  user: User | undefined;
  userDataSource = new MatTableDataSource<User>(this.users);
  enquiries: Enquiry[] = [];
  enqDataSource = new MatTableDataSource<Enquiry>(this.enquiries);

  enquiryColumns: string[] = [
    'count',
    'name',
    'propertyType',
    'methodOfContact',
    'contactInfo',
    'enqStatus',
    'assignedTo',
    'actions',
  ];
  private userNameCache = new Map<number, string>();
  private subscriptions: Subscription[] = [];
  /**
   *
   */
  constructor(
    private userService: UserService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private enquiryService: FormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([this.auth.userId$, this.auth.userRole$]).subscribe(
        ([uid, role]) => {
          if (uid) {
            this.getUserDetails(uid);
            this.cdr.markForCheck();
          }
          this.isUserAdmin = role === 'Admin';
        }
      )
    );
    this.getAllUsers();
    this.loadAllEnquiries();
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

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.userDataSource.data = this.users;
        this.userDataSource.paginator = this.userPaginator;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deleteuser(id: number) {
    Swal.fire({
      title: 'Are you sure you want to delete this enquiry?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Success',
              text: 'The user is deleted successfully.!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
            this.getAllUsers();
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              title: 'Oops!',
              text: 'The selected enquiry could not be deleted!',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          },
        });
      }
    });
  }

  editUser(id: number) {
    this.router.navigate(['/admin/edit-user', id]);
  }

  loadAllEnquiries() {
    this.enquiryService.getEnquiries().subscribe({
      next: (data) => {
        this.enquiries = data;
        this.enqDataSource.data = this.enquiries;
        this.enqDataSource.paginator = this.enqPaginator;
        this.fetchAssignedUserNames(data);
        this.cdr.markForCheck();
      },
    });
  }

  loadClassName(status: string): string {
    if (status == 'Open') {
      return 'enq-status-open';
    } else if (status == 'Completed') {
      return 'enq-status-completed';
    } else if (status == 'In Progress') {
      return 'enq-status-inprogress';
    } else {
      return '';
    }
  }

  fetchAssignedUserNames(enquiries: Enquiry[]) {
    const userIds = [
      ...new Set(
        enquiries
          .filter((enquiry) => enquiry.userId != null)
          .map((enquiry) => enquiry.userId!)
      ),
    ];

    userIds.forEach((userId) => {
      if (!this.userNameCache.has(userId)) {
        this.userService.getUser(userId).subscribe({
          next: (user) => {
            this.userNameCache.set(
              userId,
              `${user.firstName} ${user.lastName}`
            );
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error(`Error fetching user ${userId}:`, error);
            this.userNameCache.set(userId, 'Unknown');
            this.cdr.markForCheck();
          },
        });
      }
    });
  }

  getAssignedUserName(userId: number | null): string {
    if (userId == null) {
      return 'Unassigned';
    }
    return this.userNameCache.get(userId) || 'Loading...';
  }

  addUser() {
    this.router.navigate(['/admin/add-user']);
  }

  editEnquiry(id: number) {
    this.router.navigate([`admin/edit-enquiry/${id}`]);
  }

  deleteEnquiry(id: number) {
    Swal.fire({
      title: 'Are you sure you want to delete this enquiry?',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enquiryService.deleteEnquiry(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The selected enquiry was deleted successfully!',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.loadAllEnquiries();
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              title: 'Oops!',
              text: 'The selected enquiry could not be deleted!',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          },
        });
      }
    });
  }
}
