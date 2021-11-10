import {Component, Input, OnInit} from '@angular/core';
import {GraphState} from "../../../models/entities/graph/GraphState";

@Component({
  selector: 'app-information-table',
  templateUrl: './information-table.component.html',
  styleUrls: ['./information-table.component.css']
})
export class InformationTableComponent implements OnInit {

  @Input()
  graphState: GraphState;

  constructor() { }

  ngOnInit(): void {
  }

}
