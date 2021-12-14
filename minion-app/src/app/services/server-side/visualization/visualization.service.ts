import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ServerRoute} from "../ServerRoute";
import {VisualizationRoutes} from "./VisualizationRoutes";

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor(private http: HttpClient) { }

  groupBy(algorithmType: string, graphType: string, groupBy: string): Observable<any> {
    return this.http.post<any>(
      ServerRoute + VisualizationRoutes.VISUALIZATION + VisualizationRoutes.GROUP_BY,
      {algorithmType: algorithmType, graphType: graphType, groupBy: groupBy},
    );
  }

}
