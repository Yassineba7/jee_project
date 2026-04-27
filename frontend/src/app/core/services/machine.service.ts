import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/machines`;

  getAll(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  getById(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  create(machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine);
  }

  update(id: number, machine: Machine): Observable<Machine> {
    return this.http.put<Machine>(`${this.apiUrl}/${id}`, machine);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
