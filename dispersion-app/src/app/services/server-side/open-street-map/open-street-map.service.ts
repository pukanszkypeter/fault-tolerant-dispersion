import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerRoute } from '../ServerRoute';
import { OpenStreetMapRoutes } from './OpenStreetMapRoutes';

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {

  constructor(private http: HttpClient) { }

  findLocation(latlng: {lat: number, lng: number}): Observable<any> {
    return this.http.post<any>(
      ServerRoute + OpenStreetMapRoutes.OPEN_STREET_MAP + OpenStreetMapRoutes.FIND_LOCATION, latlng
    );
  }

  findCity(city: string): Observable<any> {
    return this.http.post<any>(
      ServerRoute + OpenStreetMapRoutes.OPEN_STREET_MAP + OpenStreetMapRoutes.FIND_CITY, {city: city}
    );
  }

}
