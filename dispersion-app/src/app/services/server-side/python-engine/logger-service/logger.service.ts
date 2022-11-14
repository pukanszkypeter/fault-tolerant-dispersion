import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggerServiceRoutes } from './LoggerServiceRoutes';
import { PythonEngineRoute } from '../../EngineRoutes';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private http: HttpClient) {}

  log(data: any): Observable<boolean> {
    return this.http.post<boolean>(
      PythonEngineRoute + LoggerServiceRoutes.LOGGER,
      data
    );
  }
}
