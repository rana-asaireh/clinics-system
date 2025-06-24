import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable} from "rxjs";

import { Patient } from "../../shared/models/patient.model";


import { UserService } from '../../shared/services/user.service';




@Injectable({
  providedIn: 'root'
})
export class PatientAuthService {


  baseUrl = 'http://localhost:3000/patient'
  constructor(private http: HttpClient,private  userService:UserService) { }

  getPatientsList(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl)
  }

  //check if email of user  is exist 
  checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<Patient[]>(this.baseUrl + '?email=' + email).pipe(
      map((patients) => patients.length > 0) //true if at least one match
    )

  }


  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, patient);
  }



  getPatientById(id:string):Observable<Patient>{
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }
  updatePatient(patientData :any):Observable<Patient>{
    return this.http.put<Patient>(`${this.baseUrl}/${patientData.id}`,patientData);
  }




getCurrentPatientId(email: string): Observable<string | undefined> {
  return this.http.get<Patient[]>(`${this.baseUrl}?email=${email}`).pipe(
    map(patients => {
      if (patients.length > 0) {
        return patients[0].id
      } else {
        throw new Error('Patient not found');
      }
    })
  )
}






}
