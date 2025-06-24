import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnosis } from '../models/diagnosis.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/diagnosis';
  getDiagnosis(): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(`${this.baseUrl}`);
  }
  getDiagnosisById(id?: string): Observable<Diagnosis> {
    return this.http.get<Diagnosis>(`${this.baseUrl}/${id}`);
  }
  updateDiagnosisById(id?: string, updatedDiagnosis?: Diagnosis): Observable<Diagnosis> {
    return this.http.put<Diagnosis>(`${this.baseUrl}/${id}`, updatedDiagnosis);
  }
}
