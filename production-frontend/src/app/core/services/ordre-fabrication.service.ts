import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdreFabrication } from '../models/ordre-fabrication.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdreFabricationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ordres-fabrication`;

  getAll(): Observable<OrdreFabrication[]> {
    return this.http.get<OrdreFabrication[]>(this.apiUrl);
  }

  getById(id: number): Observable<OrdreFabrication> {
    return this.http.get<OrdreFabrication>(`${this.apiUrl}/${id}`);
  }

  create(ordre: OrdreFabrication): Observable<OrdreFabrication> {
    return this.http.post<OrdreFabrication>(this.apiUrl, ordre);
  }

  update(id: number, ordre: OrdreFabrication): Observable<OrdreFabrication> {
    return this.http.put<OrdreFabrication>(`${this.apiUrl}/${id}`, ordre);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
