import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private http: HttpClient) { }

  addRandomWithColorConstraints(input: string): Observable<any> {
    console.log(input);
    return this.http.post<any>('http://localhost:4200/api/engine/logger/random-with-color-constraints', JSON.parse(input));
  }

  addLeaderWithColorConstraints(input: string): Observable<any> {
    console.log(input);
    return this.http.post<any>('http://localhost:4200/api/engine/logger/leader-with-color-constraints', JSON.parse(input));
  }


}
