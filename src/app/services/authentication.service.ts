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
  private apiurl = 'https://localhost:5000/api/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  newLogin(credentials: Authentication): Observable<any> {
    return this.http.post<any>(`${this.apiurl}/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.isAuthenticatedSubject.next(true);
          sessionStorage.setItem('userToken', response.token);
          const userRole = this.getUserRoleFromToken(response.token);
          sessionStorage.setItem('userRole', userRole);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userRole');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): void {
    const token = sessionStorage.getItem('userToken');
    if (token && this.isTokenValid(token)) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userRole');
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

  decodeToken(token: string): any {
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

  getUserIdFromToken(token: string): string | null {
    try {
      const payload = this.decodeToken(token);
      return (
        payload?.[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ] || null
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private getUserRoleFromToken(token: string): string {
    try {
      const payload = this.decodeToken(token);
      return (
        payload?.[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || ''
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('userToken');
  }
}
