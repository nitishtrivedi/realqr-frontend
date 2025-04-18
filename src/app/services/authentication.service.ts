import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

export interface Authentication {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiurl = 'https://localhost:5000/api/user';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  newLogin(credentials: Authentication): Observable<any> {
    return this.http.post<any>(`${this.apiurl}/login`, credentials).pipe(
      tap((response) => {
        console.log(response.token);
        if (response.token) {
          this.isLoggedInSubject.next(true);
          sessionStorage.setItem('userToken', response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem('userToken');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): void {
    const token = sessionStorage.getItem('userToken');
    if (token && this.isTokenValid(token)) {
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
      sessionStorage.removeItem('userToken');
      this.router.navigate(['/login']);
    }
  }

  isTokenValid(token: string): boolean {
    try {
      // Decode the JWT token
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return false;
      }
      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const buffer = 5; // 5-second buffer for clock skew
      return payload.exp > currentTime + buffer;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      // JWT is base64-encoded; split into header, payload, and signature
      const payloadBase64 = token.split('.')[1];
      // Decode base64 and parse JSON
      const decoded = atob(payloadBase64);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('userToken');
  }
}
