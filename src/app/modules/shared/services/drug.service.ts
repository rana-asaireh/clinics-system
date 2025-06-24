import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drug } from '../models/drug.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'https://json-server-gky0.onrender.com/drug';
  getDrugs(): Observable<Drug[]> {
    return this.http.get<Drug[]>(`${this.baseUrl}`);
  }
  getDrugById(id?: string): Observable<Drug> {
    return this.http.get<Drug>(`${this.baseUrl}/${id}`);
  }
  updateDrugById(id?: string, updatedDrug?: Drug): Observable<Drug> {
    return this.http.put<Drug>(`${this.baseUrl}/${id}`, updatedDrug);
  }
}
