import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, retry } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AppComponent } from '../../../app.component';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:3000/appointment'
  private doctorUrl = 'http://localhost:3000/doctor'
  private patientUrl = 'http://localhost:3000/patient'
  constructor(private http: HttpClient) { }


  getAppointmentsByAnyField(field: string, idValue: string, expandFields?: string[]): Observable<Appointment[]> {
    let url = `${this.baseUrl}?${field}=${idValue}`;

    if (expandFields?.length) {
      for (const expandField of expandFields) {
        url += `&_expand=${expandField}`;
      }
    }

    return this.http.get<Appointment[]>(url);
  }


  //get appointment by id
  getAppointmentById(appointmentId: string): Observable<Appointment> {
    return this.http.get<Appointment>(this.baseUrl + '/' + appointmentId)
  }

  getAppointmentsByPatientSorted(patientId: string, sortColumn: string, sortDirection: string): Observable<Appointment[]> {
    const url = `${this.baseUrl}?patient_id=${patientId}&_sort=${sortColumn}&_order=${sortDirection}`;
    return this.http.get<Appointment[]>(url);
  }
  getAppointmentsByPatient(patientId: string, sortColumn?: string, sortDirection: string = 'asc'): Observable<Appointment[]> {
    let url = `${this.baseUrl}?patient_id=${patientId}`;

    if (sortColumn && sortDirection) {
      url += `&_sort=${sortColumn}&_order=${sortDirection}`;
    }

    return this.http.get<Appointment[]>(url);
  }
  getFilteredAppointment(patientId: string, selectedApproval?: string, sortColumn?: string, sortDirection: string = 'asc'): Observable<Appointment[]> {
    let params = new HttpParams().set('patient_id', patientId);

    if (selectedApproval) {
      params = params.set('approval_status', selectedApproval);
    }

    if (sortColumn) {
      params = params.set('_sort', sortColumn).set('_order', sortDirection);
    }

    return this.http.get<Appointment[]>(this.baseUrl, { params });
  }

  updateAppintmentStatus(appointmentId: string, updateData: { approval_status: string }): Observable<Appointment> {
    return this.http.patch<Appointment>(this.baseUrl + '/' + appointmentId, updateData)
  }

  addAppointment(appointment: any): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}`, appointment);
    
  }




  updateAppointment(id: string, appointmentData: any): Observable<Appointment> {
  
    return this.http.patch<Appointment>(`${this.baseUrl}/${id}`, appointmentData);
  }
  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}?patientId=${patientId}`);
  }

}
