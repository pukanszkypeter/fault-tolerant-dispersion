import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Node } from 'src/app/models/core/Node';
import { Edge } from 'src/app/models/core/Edge';
import { Graph } from 'src/app/models/core/Graph';
import { GraphType } from 'src/app/models/utils/GraphType';
import { JavaEngineRoute } from '../../EngineRoutes';
import { GeneratorServiceRoutes } from './GeneratorServiceRoutes';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private http: HttpClient) { }

  generateGraph(type: GraphType, size: number): Observable<Graph<Node, Edge>> {
    let params = new HttpParams()
      .append("type", type)
      .append("size", size);
    return this.http.get<Graph<Node, Edge>>(JavaEngineRoute + GeneratorServiceRoutes.GENERATOR_SERVICE + GeneratorServiceRoutes.GRAPH, {params: params});
  }

}
