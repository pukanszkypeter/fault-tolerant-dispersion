import {Component, Input, OnInit} from '@angular/core';
import {GraphState} from "../../../models/GraphState";

@Component({
  selector: 'app-information-panel',
  templateUrl: './information-panel.component.html',
  styleUrls: ['./information-panel.component.css']
})
export class InformationPanelComponent implements OnInit {

  @Input()
  graphState: GraphState;

  constructor() { }

  ngOnInit(): void {
  }

}
