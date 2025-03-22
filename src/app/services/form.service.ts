import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enquiry } from '../models/EnquiryModel';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private apiURL = 'https://localhost:5000/api/enquiry';

  constructor(private http: HttpClient) {}

  getEnquiries(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${this.apiURL}`);
  }

  getEnquiry(id: number): Observable<Enquiry> {
    return this.http.get<Enquiry>(`${this.apiURL}/${id}`);
  }

  addEnquiry(enquiry: Enquiry): Observable<Enquiry> {
    return this.http.post<Enquiry>(`${this.apiURL}`, enquiry);
  }

  editEnquiry(id: number, enquiry: Enquiry): Observable<Enquiry> {
    return this.http.put<Enquiry>(`${this.apiURL}/${id}`, enquiry);
  }

  deleteEnquiry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
