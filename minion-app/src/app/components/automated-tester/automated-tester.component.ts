import { Component, OnInit } from '@angular/core';
import {VisService} from "../../services/client-side/vis.service";
import {GraphConfiguration} from "../../models/entities/simulator/GraphConfiguration";

@Component({
  selector: 'app-automated-test',
  templateUrl: './automated-tester.component.html',
  styleUrls: ['./automated-tester.component.css']
})
export class AutomatedTesterComponent implements OnInit {

  // Vis.js
  network: any;

  constructor(private visService: VisService) { }

  ngOnInit(): void {
  }

  runTests(event: any): void {
    const container = document.getElementById('preview-container');

    let configuration: GraphConfiguration = event.simulationConfiguration;
    // configuration.startNodes = [];
    this.network = this.visService.initGraphFromConfig(configuration, container, {});
  }

}
