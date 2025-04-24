import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Enquiry } from '../models/EnquiryModel';
import { AuthenticationService } from './authentication.service';
import { EnquiryQuestionnaire } from '../models/EnquiryQuestionnaireModel';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiURL = 'https://localhost:5000/api/enquiry';

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

  getEnquiries(): Observable<Enquiry[]> {
    return this.http
      .get<Enquiry[]>(`${this.apiURL}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getEnquiry(id: number): Observable<Enquiry> {
    return this.http
      .get<Enquiry>(`${this.apiURL}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  addEnquiry(enquiry: Enquiry): Observable<Enquiry> {
    return this.http
      .post<Enquiry>(`${this.apiURL}`, enquiry)
      .pipe(catchError(this.handleError));
  }

  editEnquiry(id: number, enquiry: Enquiry): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(`${this.apiURL}/${id}`, enquiry, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteEnquiry(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiURL}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateQuestionnaire(
    id: number,
    enquiryQuestionnaire: EnquiryQuestionnaire
  ): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(
        `${this.apiURL}/${id}/questionnaire`,
        enquiryQuestionnaire,
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
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
}
