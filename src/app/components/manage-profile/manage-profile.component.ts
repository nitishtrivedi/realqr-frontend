import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/UserModel';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-profile',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './manage-profile.component.html',
  styleUrl: './manage-profile.component.css',
})
export class ManageProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isSubmitting: boolean = false;
  userId!: number;
  user!: User;
  isAdmin: boolean = false;
  /**
   *
   */
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.initialiseForm();
    this.loadUserDetails(this.userId);
  }

  initialiseForm() {
    this.profileForm = this.fb.group({
      id: this.userId,
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      passwordHash: [''],
      email: ['', [Validators.required, Validators.email]],
      isUserAdmin: [this.isAdmin],
    });
  }

  loadUserDetails(id: number) {
    this.userService.getUser(id).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          id: this.userId,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          isUserAdmin: data.isUserAdmin,
        });
        this.isAdmin = data.isUserAdmin;
        const userNameField = this.profileForm.get('userName');
        if (!this.isAdmin) userNameField?.disable();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading user:', error);
        Swal.fire('Error', 'Could not load user details.', 'error');
      },
    });
  }

  updateProfile() {}
}
