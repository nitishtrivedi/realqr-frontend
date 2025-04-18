import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
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
        console.log(data);
      },
    });
  }
}
