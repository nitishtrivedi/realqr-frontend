import {
  AfterViewInit,
  ChangeDetectionStrategy,
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

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatButtonModule, MatPaginator, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  enquiriesData: Enquiry[] = [];
  dataSource = new MatTableDataSource<Enquiry>(this.enquiriesData);
  displayedColumns: string[] = ['name', 'propertyType', 'actions'];
  user: User | undefined;
  userid: number | undefined;
  private userSub: Subscription | undefined;
  /**
   *
   */
  constructor(
    private enquiryService: FormService,
    private userService: UserService,
    private auth: AuthenticationService
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
      },
    });
  }
  viewEnquiry(id: number) {
    console.log(id);
  }

  getUserDetails() {
    this.userSub = this.auth.userId$.subscribe((id) => {
      if (id) {
        this.userService.getUser(id).subscribe({
          next: (data) => {
            this.user = data;
          },
        });
      } else {
        this.user = undefined;
      }
    });
  }
}
