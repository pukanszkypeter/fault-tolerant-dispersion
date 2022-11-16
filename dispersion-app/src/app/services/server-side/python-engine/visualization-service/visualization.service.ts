import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VisualizationServiceRoutes } from './VisualizationServiceRoutes';
import { PythonEngineRoute } from '../../EngineRoutes';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  constructor(private http: HttpClient) {}

  summarize(summaryBy: string): Observable<any> {
    return this.http.post<any>(
      PythonEngineRoute +
        VisualizationServiceRoutes.VISUALIZATION +
        VisualizationServiceRoutes.SUMMARY_BY,
      { summaryBy: summaryBy }
    );
  }

  groupBy(
    algorithmType: string,
    graphType: string,
    groupBy: string
  ): Observable<any> {
    return this.http.post<any>(
      PythonEngineRoute +
        VisualizationServiceRoutes.VISUALIZATION +
        VisualizationServiceRoutes.GROUP_BY,
      { algorithmType: algorithmType, graphType: graphType, groupBy: groupBy }
    );
  }

  detailBy(
    detailBy: string,
    algorithmType: string,
    graphType: string
  ): Observable<any> {
    return this.http.post<any>(
      PythonEngineRoute +
        VisualizationServiceRoutes.VISUALIZATION +
        VisualizationServiceRoutes.DETAIL_BY,
      { detailBy: detailBy, algorithmType: algorithmType, graphType: graphType }
    );
  }
}
