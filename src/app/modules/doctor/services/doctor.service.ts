import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Doctor } from '../../shared/models/doctor.model';
import { UserService } from '../../shared/services/user.service';
import { Clinic } from '../../shared/models/clinic.model';
import { Appointment } from '../../shared/models/appointment.model';
import { Patient } from '../../shared/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private baseUrl = 'http://localhost:3000/doctor';
  private clinicBaseUrl = 'http://localhost:3000/clinic';
  private appointmentsUrl = 'http://localhost:3000/appointment';
  private patientsUrl = 'http://localhost:3000/patient';
  constructor(private http: HttpClient, private userService: UserService) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.baseUrl);
  }
  getDoctorById(id?: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  updateDoctorById(id?: string, updatedDoctor?: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/${id}`, updatedDoctor);
  }


  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/doctor/${id}`);
  }


  getFilteredDoctors(
    clinicId?: string,
    doctorName?: string
  ): Observable<Doctor[]> {
    let params = new HttpParams();
    if (clinicId) {
      params = params.set('clinic_id', clinicId);
    }
    if (doctorName && doctorName.trim() !== '') {
      params = params.set('name_like', doctorName);
    }
    return this.http.get<Doctor[]>(`${this.baseUrl}`, { params });
  }

  getDoctorsById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }
  updateDoctor(doctorFormData: any): Observable<Doctor> {
    return this.http.put<Doctor>(
      `${this.baseUrl}/${doctorFormData.id}`,
      doctorFormData
    );
  }
  getClinicNameById(id: string): Observable<string> {
    return this.http
      .get<Clinic>(`${this.clinicBaseUrl}/${id}`)
      .pipe(map((clinic) => clinic.name));
  }

  getDoctorByEmail(email: string): Observable<string> {
    return this.http
      .get<Doctor[]>(`${this.baseUrl}?email=${email}`)
      .pipe(
        map((doctors) => {
          if (doctors.length > 0 && doctors[0].id) {
            return doctors[0].id.toString(); 
          } else {
            throw new Error('Doctor not found');
          }
        })
      );
  }

  getPatientsByDoctor(doctorId: string) {
    return this.http.get<Appointment[]>(
      `${this.appointmentsUrl}?doctor_id=${doctorId}`
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientsUrl);
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http
      .get<Appointment[]>(`${this.appointmentsUrl}?id=${id}`)
      .pipe(map((appointments) => appointments[0]));
  }
  getPatientById(id: string): Observable<Patient> {
    return this.http
      .get<Patient[]>(`${this.patientsUrl}?id=${id}`)
      .pipe(map((patients) => patients[0]));
  }
  updateAppointmentStatus(
    id: string,
    updatedAppointment: Appointment
  ): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.appointmentsUrl}/${id}`,
      updatedAppointment
    );
  }
}
