import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/UserModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = 'https://localhost:5000/api/user';
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('userToken');
    if (token && this.authService.isTokenValid(token)) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Unauthorized: Please log in to access this resource';
    } else if (error.status === 404) {
      errorMessage = error.error?.message || 'Resource not found';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Bad request';
    }
    return throwError(() => new Error(errorMessage));
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiURL, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.apiURL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  adduser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiURL, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  editUser(user: User, id: number): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(`${this.apiURL}/${id}`, user, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiURL}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
