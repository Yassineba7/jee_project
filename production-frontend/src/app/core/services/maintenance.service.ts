import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maintenance } from '../models/maintenance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/maintenances`;

  getAll(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.apiUrl);
  }

  getById(id: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.apiUrl}/${id}`);
  }

  create(maintenance: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.apiUrl, maintenance);
  }

  update(id: number, maintenance: Maintenance): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}`, maintenance);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
