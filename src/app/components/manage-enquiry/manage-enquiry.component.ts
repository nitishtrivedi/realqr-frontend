import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Enquiry } from '../../models/EnquiryModel';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormService } from '../../services/form.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-manage-enquiry',
  imports: [RouterLink, MatExpansionModule, MatButtonModule, MatCardModule],
  templateUrl: './manage-enquiry.component.html',
  styleUrl: './manage-enquiry.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEnquiryComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  enquiry: Enquiry | undefined;
  private routeSub: Subscription | undefined;
  loading: boolean = false;
  accordion = viewChild.required(MatAccordion);
  /**
   *
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enquiryService: FormService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => this.accordion().openAll(), 0);
  }
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.loadEnquiry(id);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  loadEnquiry(id: number) {
    this.loading = true;
    this.enquiryService.getEnquiry(id).subscribe({
      next: (data) => {
        console.log(data);
        this.enquiry = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching enquiry: ' + err);
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
