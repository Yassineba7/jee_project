import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Technicien } from '../models/technicien.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicienService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/techniciens`;

  getAll(): Observable<Technicien[]> {
    return this.http.get<Technicien[]>(this.apiUrl);
  }

  getById(id: number): Observable<Technicien> {
    return this.http.get<Technicien>(`${this.apiUrl}/${id}`);
  }

  create(technicien: Technicien): Observable<Technicien> {
    return this.http.post<Technicien>(this.apiUrl, technicien);
  }

  update(id: number, technicien: Technicien): Observable<Technicien> {
    return this.http.put<Technicien>(`${this.apiUrl}/${id}`, technicien);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
