import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  usernames: string[] = [];
  isSubmitting: boolean = false;
  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.addUserForm = this.fb.group({
      userName: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: [''],
      passwordHash: ['', Validators.required],
      email: ['', Validators.required],
      isUserAdmin: [false],
    });
  }
  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.usernames = data.map((user) => user.userName);
        this.cdr.markForCheck();
      },
    });
  }

  addUser() {
    if (this.addUserForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // Disable further submissions
      const formData = { ...this.addUserForm.value };
      const inputUserName = this.addUserForm.get('userName')?.value.trim();
      const usernameExists =
        this.usernames.find((userName) => userName === inputUserName) ===
        inputUserName;

      if (usernameExists) {
        Swal.fire({
          title: 'Error',
          text: 'Username already exists. Choose a unique username',
          icon: 'error',
        });
        this.isSubmitting = false; // Re-enable submission
      } else {
        this.userService.adduser(formData).subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire({
              title: 'Success',
              text: 'User added successfully',
              icon: 'success',
            });
            this.addUserForm.reset(); // Reset form after success
            this.usernames.push(inputUserName); // Update local usernames list
            this.cdr.markForCheck();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to add user',
              icon: 'error',
            });
          },
          complete: () => {
            this.isSubmitting = false; // Re-enable submission after completion
          },
        });
      }
    }
  }
}
