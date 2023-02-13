import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
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
  ): Observable<Graph> {
    let params = new HttpParams();
    props.forEach((prop) => (params = params.append(prop.key, prop.value)));

    const TypeRoute: string = type.toLocaleLowerCase().replace(/_/g, "-");

    return this.http.get<Graph>(
      `${API}${ApiServiceRoutes.GRAPH}/${TypeRoute}`,
      {
        params: params,
      }
    );
  }
}
