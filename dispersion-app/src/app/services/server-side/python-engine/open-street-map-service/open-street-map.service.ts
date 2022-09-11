import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PythonEngineRoute } from '../../EngineRoutes';
import { OpenStreetMapRoutes } from './OpenStreetMapRoutes';

@Injectable({
  providedIn: 'root'
})
export class OpenStreetMapService {

  constructor(private http: HttpClient) { }

  findCityByLocation(lat: number, lng: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('lat', lat);
    params = params.append('lng', lng);
    
    return this.http.get<any>(
      PythonEngineRoute + OpenStreetMapRoutes.OPEN_STREET_MAP + OpenStreetMapRoutes.FIND_CITY_BY_LOCATION, {params: params}
    );
  }

  findCityByName(cityName: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('cityName', cityName);

    return this.http.get<any>(
      PythonEngineRoute + OpenStreetMapRoutes.OPEN_STREET_MAP + OpenStreetMapRoutes.FIND_CITY_BY_NAME, {params: params}
    );
  }

  createNetwork(polygon: any[]): Observable<any> {
    return this.http.post<any>(
      PythonEngineRoute + OpenStreetMapRoutes.OPEN_STREET_MAP + OpenStreetMapRoutes.CREATE_NETWORK, polygon
    )
  }

}
