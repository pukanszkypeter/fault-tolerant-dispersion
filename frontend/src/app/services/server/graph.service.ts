import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Node } from "src/app/models/graph/Node";
import { Edge } from "src/app/models/graph/Edge";
import { GraphType } from "src/app/models/graph/GraphType";
import { Graph } from "src/app/models/graph/Graph";
import { API, ApiServiceRoutes } from "./Routes";

@Injectable({
  providedIn: "root",
})
export class GraphService {
  constructor(private http: HttpClient) {}

  generate(
    type: GraphType,
    props: { key: string; value: any }[]
  ): Observable<Graph<Node, Edge>> {
    let params = new HttpParams();
    props.forEach((prop) => (params = params.append(prop.key, prop.value)));

    const TypeRoute: string = type.toLocaleLowerCase().replace(/_/g, "-");

    return this.http.get<Graph<Node, Edge>>(
      `${API}${ApiServiceRoutes.GRAPH}/${TypeRoute}`,
      {
        params: params,
      }
    );
  }
}
