import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/UserModel';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit {
  editUserForm!: FormGroup;
  isSubmitting = false;
  userId!: number;
  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm() {
    this.editUserForm = this.fb.group({
      id: this.userId,
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      passwordHash: [''], // Optional during edit
      email: ['', [Validators.required, Validators.email]],
      isUserAdmin: [false, Validators.required],
    });
  }

  loadUserData() {
    this.userService.getUser(this.userId).subscribe({
      next: (user: User) => {
        this.editUserForm.patchValue({
          id: this.userId,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isUserAdmin: user.isUserAdmin,
        });
      },
      error: (error) => {
        console.error('Error loading user:', error);
        Swal.fire('Error', 'Could not load user details.', 'error');
      },
    });
  }

  updateUser() {
    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const updatedData = this.editUserForm.value;

    this.userService.editUser(updatedData, this.userId).subscribe({
      next: () => {
        Swal.fire('Success', 'User updated successfully!', 'success');
        this.router.navigate(['/admin']); // Redirect back to admin dashboard
      },
      error: (error) => {
        console.error('Error updating user:', error);
        Swal.fire('Error', 'Could not update user.', 'error');
        this.isSubmitting = false;
      },
    });
  }
}
