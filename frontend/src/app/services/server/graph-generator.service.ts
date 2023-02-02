import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Node } from "src/app/models/core/Node";
import { Edge } from "src/app/models/core/Edge";
import { Graph } from "src/app/models/core/Graph";
import { InputProps } from "src/app/models/core/GraphSettings";
import { GraphType } from "src/app/models/core/GraphType";

@Injectable({
  providedIn: "root",
})
export class GraphGeneratorService {
  constructor(private http: HttpClient) {}

  generate(
    type: GraphType,
    settings: InputProps
  ): Observable<Graph<Node, Edge>> {
    let params = new HttpParams().appendAll(settings);
    const TypeRoute: string = "/" + type.toLocaleLowerCase().replace(/_/g, "-");
    return this.http.get<Graph<Node, Edge>>("" + "" + TypeRoute, {
      params: params,
    });
  }
}
