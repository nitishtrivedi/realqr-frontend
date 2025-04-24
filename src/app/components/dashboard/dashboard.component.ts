import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormService } from '../../services/form.service';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Enquiry } from '../../models/EnquiryModel';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginator,
    MatPaginatorModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  enquiriesData: Enquiry[] = [];
  dataSource = new MatTableDataSource<Enquiry>(this.enquiriesData);
  displayedColumns: string[] = [
    'count',
    'name',
    'propertyType',
    'methodOfContact',
    'contactInfo',
    'enqStatus',
    'actions',
  ];
  user: User | undefined;
  userid: number | undefined;
  private userSub: Subscription | undefined;
  enqStatusCssArray: string[] = [];
  /**
   *
   */
  constructor(
    private enquiryService: FormService,
    private userService: UserService,
    private auth: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEnquiries();
    this.getUserDetails();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  loadEnquiries() {
    this.enquiryService.getEnquiries().subscribe({
      next: (data) => {
        this.enquiriesData = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;

        this.cdr.markForCheck();
      },
    });
  }
  viewEnquiry(id: number) {
    this.router.navigate(['/manage-enquiry', id]);
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
            this.loadEnquiries();
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

  getUserDetails() {
    this.userSub = this.auth.userId$.subscribe((id) => {
      if (id) {
        this.userService.getUser(id).subscribe({
          next: (data) => {
            this.user = data;
            this.cdr.markForCheck();
          },
        });
      } else {
        this.user = undefined;
        this.cdr.markForCheck();
      }
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
}
