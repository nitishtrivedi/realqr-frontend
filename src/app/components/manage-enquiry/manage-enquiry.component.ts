import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { Enquiry } from '../../models/EnquiryModel';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormService } from '../../services/form.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-enquiry',
  imports: [
    RouterLink,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    NgFor,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
  ],
  templateUrl: './manage-enquiry.component.html',
  styleUrl: './manage-enquiry.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEnquiryComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  enquiry: Enquiry | undefined;
  user: User | undefined;
  private routeSub: Subscription | undefined;
  loading: boolean = false;
  accordion = viewChild.required(MatAccordion);

  enquiryQuestionnaireForm: FormGroup;
  enquiryId: number | undefined;
  enqStatusDDL: string[] = [
    'Open',
    'In Progress',
    'Completed',
    'Failed / Cancelled',
  ];
  agentName: string = '';
  modeOfPayment: string[] = ['Loan', 'Self Funded', 'Other'];
  followUpActions: string[] = [
    'Contact customer to confirm details and needs',
    'Verify and refine budget and payment method',
    'Share 3-5 matching property listings',
    'Connect with loan vendor if consented',
    'Schedule property viewings and log feedback',
    'Update enquiry status and actions taken',
    'Answer questions and note comments',
    'Explain next steps and plan follow-up',
  ];
  /**
   *
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enquiryService: FormService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.enquiryQuestionnaireForm = this.fb.group({
      enquiryStatus: [''],
      agentName: [''],
      hasConfirmedBudget: [true],
      refinedBudgetRange: [''],
      reconfirmModeOfPayment: [''],
      loanProcessingConsent: [true],
      loanProcessingVendor: [''],
      followUpActions: [''],
      comments: [''],
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.accordion().openAll(), 0);
  }
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.enquiryId = id;
      if (id) {
        this.loadEnquiry(id);
      }
    });
    this.loadUser();
  }
  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  loadEnquiry(id: number) {
    this.loading = true;
    this.enquiryService.getEnquiry(id).subscribe({
      next: (data) => {
        this.enquiry = data;
        this.loading = false;
        this.enquiryQuestionnaireForm.patchValue({
          enquiryStatus: data.enquiryQuestionnaire.enquiryStatus,
          reconfirmModeOfPayment:
            data.enquiryQuestionnaire.reconfirmModeOfPayment,
          loanProcessingConsent:
            data.enquiryQuestionnaire.loanProcessingConsent,
          loanProcessingVendor: data.enquiryQuestionnaire.loanProcessingVendor,
          agentName: this.agentName, // Preserve agentName from user data
          hasConfirmedBudget: data.enquiryQuestionnaire.hasConfirmedBudget,
          refinedBudgetRange: data.enquiryQuestionnaire.refinedBudgetRange,
          followUpActions: data.enquiryQuestionnaire.followUpActions,
          comments: data.enquiryQuestionnaire.comments,
        });
        this.handleFormLogic();
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

  loadUser() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.userService.getUser(parseInt(userId)).subscribe({
        next: (data) => {
          this.user = data;
          this.agentName = `${data.firstName} ${data.lastName}`;
          this.enquiryQuestionnaireForm.patchValue({
            agentName: `${data.firstName} ${data.lastName}`,
          });
          this.cdr.markForCheck();
        },
      });
    }
  }

  submitForm() {
    const formData = {
      id: this.enquiry?.enquiryQuestionnaire.id,
      enquiryId: this.enquiryId,
      ...this.enquiryQuestionnaireForm.value,
    };
    console.log(formData);
    if (this.enquiryId) {
      this.enquiryService
        .updateQuestionnaire(this.enquiryId, formData)
        .subscribe({
          next: (response) => {
            console.log(response);
            if (this.enquiryId) {
              Swal.fire({
                title: 'Success!',
                text: 'Your enquiry has been updated successfully!',
                icon: 'success',
                confirmButtonText: 'Ok',
              });
              this.loadEnquiry(this.enquiryId);
            }
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              title: 'Oops!',
              text: 'Your enquiry could not be updated!',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          },
        });
    }
  }

  //#region EVENTS AND OTHER CODE
  showSelection(event: MatRadioChange) {
    const refinedBudgetControl =
      this.enquiryQuestionnaireForm.get('refinedBudgetRange');
    if (event.value) {
      refinedBudgetControl?.disable();
      refinedBudgetControl?.setValue('');
    } else {
      refinedBudgetControl?.enable();
    }
  }
  loanProcessConsentChange(event: MatRadioChange) {
    const loanConsentControl = this.enquiryQuestionnaireForm.get(
      'loanProcessingConsent'
    );
    const loanProcessingVendorControl = this.enquiryQuestionnaireForm.get(
      'loanProcessingVendor'
    );
    if (loanConsentControl?.enabled) {
      if (event.value) {
        console.log(event.value);
        loanProcessingVendorControl?.disable();
      } else {
        loanProcessingVendorControl?.enable();
      }
    } else {
      loanProcessingVendorControl?.disable();
    }
  }

  mopValueChanged(event: MatSelectChange) {
    const loanProcessingConsentRG = this.enquiryQuestionnaireForm.get(
      'loanProcessingConsent'
    );
    const loanConsentControl = this.enquiryQuestionnaireForm.get(
      'loanProcessingConsent'
    );
    const value = event.value;
    if (value === 'Loan') {
      loanProcessingConsentRG?.setValue(true);
      loanConsentControl?.enable();
    } else {
      loanProcessingConsentRG?.setValue(false);
      loanConsentControl?.disable();
    }
    this.cdr.markForCheck();
  }

  handleFormLogic() {
    //Budget Confirmed and Reconfirmed Budget Section
    const confirmedBudgetControl =
      this.enquiryQuestionnaireForm.get('hasConfirmedBudget');
    const confirmedBudgetValue = confirmedBudgetControl?.value;
    const refinedBudgetControl =
      this.enquiryQuestionnaireForm.get('refinedBudgetRange');
    const refinedBudgetValue = refinedBudgetControl?.value;

    console.log('RB: ' + confirmedBudgetValue + ', TB: ' + refinedBudgetValue);

    if (confirmedBudgetValue) {
      refinedBudgetControl?.disable();
    } else {
      refinedBudgetControl?.enable();
    }

    //Budget Confirmed and Reconfirmed Budget Section

    const loanProcessingVendorControl = this.enquiryQuestionnaireForm.get(
      'loanProcessingVendor'
    );
    loanProcessingVendorControl?.disable();

    const mopControl = this.enquiryQuestionnaireForm.get(
      'reconfirmModeOfPayment'
    );
    const loanConsentControl = this.enquiryQuestionnaireForm.get(
      'loanProcessingConsent'
    );
    const mopValue = mopControl?.value;
    if (mopValue == 'Loan') {
      loanConsentControl?.enable();
      loanConsentControl?.setValue(true);
    } else {
      loanConsentControl?.disable();
      loanConsentControl?.setValue(false);
    }
  }
  //#endregion
}
