import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Clinic } from '../../shared/models/clinic.model';
import { Doctor } from '../../shared/models/doctor.model';
import { Drug } from '../../shared/models/drug.model';
import { Diagnosis } from '../../shared/models/diagnosis.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000';

  addClinic(clinic: Clinic): Observable<Clinic> {
    return this.http.post<Clinic>(`${this.baseUrl}/clinic`, clinic);
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/doctor`, doctor);
  }

  addDrug(drug: Drug): Observable<Drug> {
    return this.http.post<Drug>(`${this.baseUrl}/drug`, drug);
  }

  addDiagnosis(diagnosis: Diagnosis): Observable<Diagnosis> {
    return this.http.post<Diagnosis>(`${this.baseUrl}/diagnosis`, diagnosis);
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctor?email=${email}`).pipe(
      map((doctors) => doctors.length > 0)
    )
  }

  deleteClinic(id: string): Observable<Clinic> {
    return this.http.delete<Clinic>(`${this.baseUrl}/clinic/${id}`);
  }

  deleteDoctor(id: string): Observable<Doctor> {
    return this.http.delete<Doctor>(`${this.baseUrl}/doctor/${id}`);
  }

  deleteDrug(id: string): Observable<Drug> {
    return this.http.delete<Drug>(`${this.baseUrl}/drug/${id}`);
  }

  deleteDiagnosis(id: string): Observable<Diagnosis> {
    return this.http.delete<Diagnosis>(`${this.baseUrl}/diagnosis/${id}`);
  }
}
