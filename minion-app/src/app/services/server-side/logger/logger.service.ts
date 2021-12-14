import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ServerRoute} from "../ServerRoute";
import {LoggerRoutes} from "./LoggerRoutes";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private http: HttpClient) { }

  log(data: any): Observable<boolean> {
    return this.http.post<boolean>(ServerRoute + LoggerRoutes.LOGGER, data);
  }

}
