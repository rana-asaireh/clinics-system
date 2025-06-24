import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/users'; 
  private patientsBaseUrl = 'http://localhost:3000/patient';
  private doctorsBaseUrl = 'http://localhost:3000/doctor'; 
  constructor(private http: HttpClient, private router: Router) { }
  getUser(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}&password=${password}`)
  }
  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  getCurrentUserType(): string {
    const user = this.getCurrentUser();
    return user?.type || '';
  }

  getTypeUser() {
    return JSON.parse(localStorage.getItem('typeUser') || '');
  }
addUserDoctor(doctor: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, doctor);
  }

  getUserDoctorByEmail(email: string): Observable<User> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}`).pipe(
      map(users => users[0])
    );
  }
  updateUserDoctorByid(id?: string, updatedUserDoctor?: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, updatedUserDoctor);
  }
  deleteUserDoctorByid(id?: string): Observable<User> {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
     
  }


  addUser(user: User): Observable<User> {

    return this.http.post<User>(this.baseUrl, user).pipe(
      map((userWithId) => {

       
        this.http.delete<void>(`${this.baseUrl}/${user.id}`);
        const { id, ...userWithoutId } = userWithId; 
        return userWithId; 
      })
    );
  }
  getCurrentPatientId(): any { 
    const user = this.getCurrentUser();
  
    return user?.id || null;
  }
  getCurrentDoctorId(): any { 
    const user = this.getCurrentUser();
  
    return user?.id || null;
  }
  getPatientByEmail(email:string):Observable<any>{
    return this.http.get<any>(`${this.patientsBaseUrl}?email=${email}`)
  }
  
  getDoctorByEmail(email: string) :Observable<any> {
    return this.http.get<any>(`${this.doctorsBaseUrl}?email=${email}`)
  }

  getUserByPatientId(patientId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?id=${patientId}&type=patient`);
  }
  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}`);
  }
  updateUser(userData: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userData.id}`, userData);
  }
}
