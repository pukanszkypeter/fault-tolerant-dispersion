import { Component, OnInit } from '@angular/core';
import {VisService} from "../../services/client-side/vis.service";
import {SimulationConfiguration} from "../../models/entities/simulation/SimulationConfiguration";

@Component({
  selector: 'app-automated-test',
  templateUrl: './automated-test.component.html',
  styleUrls: ['./automated-test.component.css']
})
export class AutomatedTestComponent implements OnInit {

  // Vis.js
  network: any;

  constructor(private visService: VisService) { }

  ngOnInit(): void {
  }

  runTests(event: any): void {
    const container = document.getElementById('preview-container');

    let configuration: SimulationConfiguration = event.simulationConfiguration;
    configuration.startNodes = [];
    this.network = this.visService.initGraphFromConfig(configuration, container, {});
  }

}
