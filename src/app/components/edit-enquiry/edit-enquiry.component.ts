import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { Enquiry } from '../../models/EnquiryModel';
import { User } from '../../models/UserModel';
import { UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-edit-enquiry',
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
  ],
  templateUrl: './edit-enquiry.component.html',
  styleUrl: './edit-enquiry.component.css',
})
export class EditEnquiryComponent implements OnInit {
  enquiryId!: number;
  enquiry!: Enquiry;
  users: User[] = [];
  editEnquiryForm!: FormGroup;
  /**
   *
   */
  constructor(
    private route: ActivatedRoute,
    private enquiryService: FormService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.enquiryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEnquiry(this.enquiryId);
    this.getAllUsers();
  }

  loadEnquiry(id: number) {
    this.enquiryService.getEnquiry(id).subscribe({
      next: (data) => {
        this.enquiry = data;
        console.log(data);
        this.initForm();
        this.cdr.markForCheck();
      },
    });
  }

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.markForCheck();
      },
    });
  }

  initForm() {
    this.editEnquiryForm = this.fb.group({
      firstName: [this.enquiry.firstName],
      lastName: [this.enquiry.lastName],
      email: [this.enquiry.email],
      contactNumber: [this.enquiry.contactNumber],
      methodOfContact: [this.enquiry.methodOfContact],
      budgetRange: [this.enquiry.budgetRange],
      preferredAreas: [this.enquiry.preferredAreas],
      propertyType: [this.enquiry.propertyType],
      modeOfPayment: [this.enquiry.modeOfPayment],
      purchaseTimeFrame: [this.enquiry.purchaseTimeFrame],
      userId: [this.enquiry.userId],
    });
  }
  save() {
    const updatedEnquiry = {
      ...this.enquiry,
      ...this.editEnquiryForm.value,
    };

    this.enquiryService.editEnquiry(this.enquiryId, updatedEnquiry).subscribe({
      next: () => {
        Swal.fire('Success', 'Enquiry updated successfully!', 'success');
        this.cdr.markForCheck();
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Enquiry could not be updated!', 'error');
      },
    });
  }
}
