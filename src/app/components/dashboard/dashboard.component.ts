import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
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

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatButtonModule, MatPaginator, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  enquiriesData: Enquiry[] = [];
  dataSource = new MatTableDataSource<Enquiry>(this.enquiriesData);
  displayedColumns: string[] = ['name', 'actions'];
  /**
   *
   */
  constructor(private enquiryService: FormService) {}

  ngOnInit(): void {
    this.loadEnquiries();
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
}
