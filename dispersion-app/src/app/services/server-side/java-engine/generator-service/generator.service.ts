import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Node } from 'src/app/models/core/Node';
import { Edge } from 'src/app/models/core/Edge';
import { Graph } from 'src/app/models/core/Graph';
import { GraphType } from 'src/app/models/utils/GraphType';
import { JavaEngineRoute } from '../../EngineRoutes';
import { GraphGenerator } from './GeneratorServiceRoutes';
import { InputProps } from 'src/app/models/utils/GraphSettings';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private http: HttpClient) { }

  generateGraph(type: GraphType, settings: InputProps): Observable<Graph<Node, Edge>> {
    let params = new HttpParams().appendAll(settings);
    const TypeRoute: string = "/" + type.toLocaleLowerCase().replace(/_/g, "-");
    return this.http.get<Graph<Node, Edge>>(JavaEngineRoute + GraphGenerator + TypeRoute, {params: params});
  }

}
