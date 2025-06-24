import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Clinic } from '../models/clinic.model';


@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/clinic';
  getClinics(): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${this.baseUrl}`);
  }
  getClinicById(id?: string): Observable<Clinic> {
    return this.http.get<Clinic>(`${this.baseUrl}/${id}`);
  }
  updateClinicById(id?: string, updatedClinic?: Clinic): Observable<Clinic> {
    return this.http.put<Clinic>(`${this.baseUrl}/${id}`, updatedClinic);
    
    }

    getClinic(id: number): Observable<Clinic> {
      return this.http.get<Clinic>(`${this.baseUrl}/${id}`)
  }
  getClinicNameById(id: string): Observable<string> {
    return this.http.get<Clinic>(`${this.baseUrl}/${id}`).pipe(
      map((clinic: Clinic)  => clinic.name)
    );
  }
}
