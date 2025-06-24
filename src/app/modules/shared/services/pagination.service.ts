import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diagnosis } from '../models/diagnosis.model';
import { Drug } from '../models/drug.model';
import { Doctor } from '../models/doctor.model';
import { Clinic } from '../models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private apiUrlDiagnosis = 'https://json-server-gky0.onrender.com/diagnosis';
  private apiUrlDrug = 'https://json-server-gky0.onrender.com/drug';
  private apiUrlDoctor = 'https://json-server-gky0.onrender.com/doctor';
  private apiUrlClinic = 'https://json-server-gky0.onrender.com/clinic';

  constructor(private http: HttpClient) { }

  getDiagnosesByPage(startIndex: number, pageSize: number): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(`${this.apiUrlDiagnosis}?_start=${startIndex}&_limit=${pageSize}`);
  }
  getDrugsByPage(startIndex: number, pageSize: number): Observable<Drug[]> {
    return this.http.get<Drug[]>(`${this.apiUrlDrug}?_start=${startIndex}&_limit=${pageSize}`);
  }
  getDoctorsByPage(startIndex: number, pageSize: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrlDoctor}?_start=${startIndex}&_limit=${pageSize}`);
  }
  getClinicsByPage(startIndex: number, pageSize: number): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${this.apiUrlClinic}?_start=${startIndex}&_limit=${pageSize}`);
  }

  paginate<T>(items: T[], currentPage: number, pageSize: number): T[] {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

  getTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize);
  }

  generatePageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}
