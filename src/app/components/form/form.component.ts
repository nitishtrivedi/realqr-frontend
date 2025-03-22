import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    NgFor,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  contactMethods: string[] = ['Phone', 'E-Mail', 'None'];
  budgetRange: string[] = [
    '50 - 75 Lacs',
    '75 Lacs - 1.25 Cr',
    '1.25 Cr - 2.00 Cr',
    '2.00 Cr - 4.00 Cr',
    '4.00 Cr and Above',
  ];
  preferredAreas: string[] = [
    'City Area - Shivajinagar - Camp',
    'Aundh - Baner - Pashan - Bavdhan',
    'Hinjewadi - Wakad - Kalewadi',
    'Swargate - Bibwewadi - Katraj',
    'Sinhgad Road - Khadakwasla',
    'Kothrud - Karvenagar - Warje',
    'Deccan Gymkhana - SB Road - Gokhalenagar',
    'Vishrantwadi - Dhanori - Lohgaon',
    'Vimannagar - Kharadi - Wagholi',
    'PCMC',
    'Other',
  ];

  propertyType: string[] = [
    'Flat',
    'Bungalow',
    'Villa',
    'Rowhouse',
    'Duplex',
    'Studio Apartment',
    'Other',
  ];
  modeOfPayment: string[] = ['Loan', 'Self Funded', 'Other'];
  purchaseTimeFrames: string[] = [
    'Immediate',
    '1 - 3 Months',
    '6 - 9 Months',
    'More than 12 Months',
  ];

  constructor() {}
  ngOnInit(): void {}
}
