import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SnackbarService } from 'src/app/services/client-side/utils/snackbar.service';
import { icon, Marker } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { AlgorithmSelectDialogComponent } from './algorithm-select-dialog/algorithm-select-dialog.component';
import { AlgorithmService } from 'src/app/services/server-side/java-engine/algorithm-service/algorithm.service';
import { Edge } from 'src/app/models/core/Edge';
import { Robot } from 'src/app/models/core/Robot';
import { SimulationStep } from 'src/app/models/dto/SimulationStep';
import { SimulationState } from 'src/app/models/utils/SimulationState';
import { RandomDispersionNode } from 'src/app/models/algorithms/random-dispersion/RandomDispersionNode';
import { RandomDispersionEdge } from 'src/app/models/algorithms/random-dispersion/RandomDispersionEdge';
import { RandomDispersionRobot } from 'src/app/models/algorithms/random-dispersion/RandomDispersionRobot';
import { RandomWithLeaderDispersionNode } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionNode';
import { RandomWithLeaderDispersionEdge } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionEdge';
import { RandomWithLeaderDispersionRobot } from 'src/app/models/algorithms/random-with-leader-dispersion/RandomWithLeaderDispersionRobot';
import { RotorRouterDispersionNode } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionNode';
import { RotorRouterDispersionEdge } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionEdge';
import { RotorRouterDispersionRobot } from 'src/app/models/algorithms/rotor-router-dispersion/RotorRouterDispersionRobot';
import { RotorRouterWithLeaderDispersionNode } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionNode';
import { RotorRouterWithLeaderDispersionEdge } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionEdge';
import { RotorRouterWithLeaderDispersionRobot } from 'src/app/models/algorithms/rotor-router-with-leader-dispersion/RotorRouterWithLeaderDispersionRobot';
import { OpenStreetMapService } from 'src/app/services/server-side/python-engine/open-street-map-service/open-street-map.service';
import { Node } from 'src/app/models/core/Node';
import { NodeState } from 'src/app/models/utils/NodeState';
import { Color, getColorByHex } from 'src/app/models/utils/Color';
import { AlgorithmType } from 'src/app/models/utils/AlgorithmType';
import { Graph } from 'src/app/models/core/Graph';
import { VisService } from 'src/app/services/client-side/vis/vis.service';
import { RobotState } from 'src/app/models/utils/RobotState';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-open-street-map',
  templateUrl: './open-street-map.component.html',
  styleUrls: ['./open-street-map.component.css']
})
export class OpenStreetMapComponent implements OnInit {

  private map: L.Map;
  private defaultCentroid: L.LatLngExpression = [47.497913, 19.040236]; // Budapest
  private defaultZoom = 8;

  private defaultLayer: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 3,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  private cityLayer: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 14,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  loading = false;

  selectedCity: {lat: number, lng: number, location: string};
  cityControl: FormControl;

  polygon = new L.Polygon([]);
  polygonCoordinates: any[] = [];
  polygonMarkers: any[] = [];

  nodes: Node[] = [];
  nodeMarkers: L.Marker[] = [];
  edges: Edge[] = [];
  edgeLines: L.Polyline[] = [];
  robots: any[] = [];

  selectedNodeID = 0;
  algorithmType = '';

  // Simulator
  randomSimulation: SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot>;
  randomWithLeaderSimulation: SimulationStep<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge, RandomWithLeaderDispersionRobot>;
  rotorRouterSimulation: SimulationStep<RotorRouterDispersionNode, RotorRouterDispersionEdge, RotorRouterDispersionRobot>;
  rotorRouterWithLeaderSimulation: SimulationStep<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge, RotorRouterWithLeaderDispersionRobot>;
  speed: number = 750;
  steps: number = 0;
  RTT: number = 0;
  STOPPED = false;

  constructor(
              private openStreetMapService: OpenStreetMapService,
              private snackBarService: SnackbarService,
              private algorithmService: AlgorithmService,
              private visService: VisService,
              public dialog: MatDialog
              )
  {
    this.cityControl = new FormControl('');
  }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {}).setView(this.defaultCentroid, this.defaultZoom);

    this.defaultLayer.addTo(this.map);
    this.polygon.addTo(this.map);

    const onMapClick = (event: any) => {
      if (this.selectedCity === undefined) {
        this.findCity(event.latlng);
      } else {
        if (this.nodes.length === 0 && this.edges.length === 0) {
          this.polygonCoordinates.push(event.latlng);
          var marker = L.marker([event.latlng.lat, event.latlng.lng])
            .addEventListener('contextmenu', (event: L.LeafletEvent) => {
              this.removeMarker(event.target._latlng);
            })
            .addTo(this.map);
          this.polygonMarkers.push(marker);
          this.polygon.addLatLng(event.latlng);
        }
      }
    }

    this.map.on('click', onMapClick);
  }

  findCityByName(): void {
    if (this.cityControl.value !== '') {
      var cityName = this.cityControl.value;
      this.cityControl.setValue('');
      this.findCity(cityName);
    }
  }

  findCity(params: string | any): void {
    const findCityFn =
      typeof params === 'string' ?
        this.openStreetMapService.findCityByName(params) :
        this.openStreetMapService.findCityByLocation(params.lat, params.lng);

    this.loading = true;
    findCityFn.subscribe(res => {
      if (res !== null) {
        this.selectedCity = res;
        // swap layers
        this.map.removeLayer(this.defaultLayer);
        this.cityLayer.addTo(this.map);
        // set view
        this.map.setView([this.selectedCity.lat, this.selectedCity.lng], 14);
      } else {
        this.snackBarService.openSnackBar('openStreetMapComponent_cityNotFound', 'error-snackbar');
      }
      this.loading = false;
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
      this.loading = false;
    });
  }

  resetSelectedCity(): void {
    this.selectedCity = undefined;
    // swap layers
    this.map.removeLayer(this.cityLayer);
    this.map.addLayer(this.defaultLayer);
    // set view
    this.map.setView(this.defaultCentroid, this.defaultZoom);
    // reset polygons and markers
    this.polygon.setLatLngs([]);
    this.polygonCoordinates = [];
    this.polygonMarkers.forEach(marker => marker.remove(this.map));
    this.polygonMarkers = [];
    // reset network
    this.nodes = [];
    this.nodeMarkers.forEach(marker => marker.remove());
    this.nodeMarkers = [];
    this.edges = [];
    this.edgeLines.forEach(marker => marker.remove());
    this.edgeLines = [];
    // robots
    this.robots = [];
    this.selectedNodeID = 0;
    // algorithm type
    this.algorithmType = '';
    // simulator
    this.randomSimulation = undefined;
    this.randomWithLeaderSimulation = undefined;
    this.rotorRouterSimulation = undefined;
    this.rotorRouterWithLeaderSimulation = undefined;
    this.steps = 0;
    this.RTT = 0;
    this.STOPPED = false;
  }

  removeMarker(coordinate: any): void {
    const index = this.polygonCoordinates.findIndex(latlng => (latlng.lat === coordinate.lat) && (latlng.lng === coordinate.lng));

    if (index > -1) {
      // remove marker
      this.polygonCoordinates.splice(index, 1);
      this.map.removeLayer(this.polygonMarkers[index]);
      this.polygonMarkers.splice(index, 1);
      // remove point from polygon
      this.polygon.setLatLngs(this.polygonCoordinates);
    }
  }

  createNetwork(): void {
    this.loading = true;
    this.openStreetMapService.createNetwork(this.polygonCoordinates).subscribe(res => {
      this.loading = false;

      // reset polygons and markers
      this.polygon.setLatLngs([]);
      this.polygonCoordinates = [];
      this.polygonMarkers.forEach(marker => marker.remove(this.map));
      this.polygonMarkers = [];

      const graph = JSON.parse(res);

      for (let i in graph.nodes) {
        let node = JSON.parse(graph.nodes[JSON.parse(i)]);

        var defaultIcon = L.divIcon({
          iconSize: [25, 25],
          html:'<div style="border-radius: 50%; background-color: dodgerblue; justify-content: center; display: flex; align-items: center; color: white; width: 25px; height: 25px;"> ' + node.id + ' </div>',
          className: 'custom-marker-icon'
        });

        var marker = L.marker([node.X, node.Y], {icon: defaultIcon});
        marker.addEventListener("click",  (event) => {
          const latlng = event.target._latlng;
          const index = this.nodeMarkers.findIndex(marker => marker.getLatLng().lat === latlng.lat && marker.getLatLng().lng === latlng.lng);
          this.selectedNodeID = index + 1;
        });
        marker.addTo(this.map);
        this.nodeMarkers.push(marker);

        this.nodes.push(new Node(node.id, NodeState.DEFAULT));
      }

      for (let i in graph.edges) {
        let edge = JSON.parse(graph.edges[JSON.parse(i)]);

        const fromIndex = this.nodes.findIndex(node => node.id === edge.fromID);
        const toIndex = this.nodes.findIndex(node => node.id === edge.toID);
        if (fromIndex > -1 && toIndex > -1) {
          var latlngs = [
            [this.nodeMarkers[fromIndex].getLatLng().lat, this.nodeMarkers[fromIndex].getLatLng().lng],
            [this.nodeMarkers[toIndex].getLatLng().lat, this.nodeMarkers[toIndex].getLatLng().lng]
          ];
          var polyline = L.polyline(latlngs as [number, number][]).addTo(this.map);
          this.edgeLines.push(polyline);
        }

        this.edges.push(new Edge(edge.id, edge.fromID, edge.toID));
      }

    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
      this.loading = false;
    });
  }

  selectAlgorithmType(): void {
    const dialogRef = this.dialog.open(AlgorithmSelectDialogComponent, {
      width: '20%',
      height: '30%',
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.algorithmType = res.algorithmType;
        for (let i = 0; i < this.robots.length; i++) {
          this.robots[i].id = i + 1;
        }

        switch (this.algorithmType) {

          case AlgorithmType.RANDOM_DISPERSION:
            this.randomSimulation = new SimulationStep(
              this.algorithmType, 
              SimulationState.DEFAULT, 
              0, 
              new Graph<RandomDispersionNode, RandomDispersionEdge>(
                this.visService.nodes.map(node => new RandomDispersionNode(node.id, NodeState.DEFAULT)),
                this.visService.edges.map(edge => new RandomDispersionEdge(edge.id, edge.from, edge.to, getColorByHex(edge.color)))
                ), 
              this.robots
            );
            break;

          case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
            this.randomWithLeaderSimulation = new SimulationStep(
              this.algorithmType, 
              SimulationState.DEFAULT, 
              0, 
              new Graph<RandomWithLeaderDispersionNode, RandomWithLeaderDispersionEdge>(
                this.visService.nodes.map(node => new RandomWithLeaderDispersionNode(node.id, NodeState.DEFAULT)),
                this.visService.edges.map(edge => new RandomWithLeaderDispersionEdge(edge.id, edge.from, edge.to, getColorByHex(edge.color)))
                ), 
              this.robots
            );
            break;

          case AlgorithmType.ROTOR_ROUTER_DISPERSION:
            this.rotorRouterSimulation = new SimulationStep(
              this.algorithmType, 
              SimulationState.DEFAULT, 
              0, 
              new Graph<RotorRouterDispersionNode, RotorRouterDispersionEdge>(
                this.visService.nodes.map(node => new RotorRouterDispersionNode(node.id, NodeState.DEFAULT, null)),
                this.visService.edges.map(edge => new RotorRouterDispersionEdge(edge.id, edge.from, edge.to, getColorByHex(edge.color)))
                ), 
              this.robots
            );
            break;

          case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
            this.rotorRouterWithLeaderSimulation = new SimulationStep(
              this.algorithmType, 
              SimulationState.DEFAULT, 
              0, 
              new Graph<RotorRouterWithLeaderDispersionNode, RotorRouterWithLeaderDispersionEdge>(
                this.visService.nodes.map(node => new RotorRouterWithLeaderDispersionNode(node.id, NodeState.DEFAULT, null)),
                this.visService.edges.map(edge => new RotorRouterWithLeaderDispersionEdge(edge.id, edge.from, edge.to, getColorByHex(edge.color)))
                ), 
              this.robots
            );
            break;

          default: 
            throw new Error('Algorithm type not found!');
        }
      }
    });
  }

  getRobots(): number {
    return this.robots.filter(robot => robot.onID === this.selectedNodeID).length;
  }

  addRobot(): void {
    if (this.algorithmType) {
      switch (this.algorithmType) {
        case AlgorithmType.RANDOM_DISPERSION:
          this.robots.push(new RandomDispersionRobot(1, RobotState.START, Color.BLACK, this.selectedNodeID, null));
          break;
        case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
          this.robots.push(new RandomWithLeaderDispersionRobot(1, RobotState.START, Color.BLACK, this.selectedNodeID, null));
          break;
        case AlgorithmType.ROTOR_ROUTER_DISPERSION:
          this.robots.push(new RotorRouterDispersionRobot(1, RobotState.START, Color.BLACK, this.selectedNodeID, null));
          break;
        case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
          this.robots.push(new RotorRouterWithLeaderDispersionRobot(1, RobotState.START, Color.BLACK, this.selectedNodeID, null, null));
          break;
        default:
          throw new Error('Algorithm type not found!');
      }
  
      const robots = this.getRobots();
      if (robots === 1) {
        var pendingIcon = L.divIcon({
          iconSize: [25, 25],
          html:'<div style="border-radius: 50%; background-color: red; justify-content: center; display: flex; align-items: center; color: white; width: 25px; height: 25px;"> ' + this.selectedNodeID + ' </div>',
          className: 'custom-marker-icon'
        });
        this.nodeMarkers[this.selectedNodeID - 1].setIcon(pendingIcon);
      }
    }
  }

  removeRobot(): void {
    const index = this.robots.findIndex(robot => robot.onID === this.selectedNodeID);
    if (index > -1) {
      this.robots.splice(index, 1);
    }
    const robots = this.getRobots();
    if (robots === 0) {
      var defaultIcon = L.divIcon({
        iconSize: [25, 25],
        html:'<div style="border-radius: 50%; background-color: dodgerblue; justify-content: center; display: flex; align-items: center; color: white; width: 25px; height: 25px;"> ' + this.selectedNodeID + ' </div>',
        className: 'custom-marker-icon'
      });
      this.nodeMarkers[this.selectedNodeID - 1].setIcon(defaultIcon);
    }
  }

  async playSimulator(): Promise<void> {
    this.STOPPED = false;
    let currentSimulation;
    switch (this.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        currentSimulation = this.randomSimulation;
        break;
      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        currentSimulation = this.randomWithLeaderSimulation;
        break;
      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        currentSimulation = this.rotorRouterSimulation;
        break;
      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        currentSimulation = this.rotorRouterWithLeaderSimulation;
        break;
    }

    while (!this.STOPPED && currentSimulation.simulationState !== SimulationState.FINISHED) {
      await this.stepSimulator();
      await this.sleep(this.speed);
    }
  }

  stopSimulator(): void {
    this.STOPPED = true;
  }

  async stepSimulator(): Promise<void> {
    switch (this.algorithmType) {
      case AlgorithmType.RANDOM_DISPERSION:
        if (this.randomSimulation.simulationState !== SimulationState.FINISHED) {
          const start = new Date();
          this.algorithmService.stepRandom(this.randomSimulation)
            .subscribe((res: SimulationStep<RandomDispersionNode, RandomDispersionEdge, RandomDispersionRobot>) => {
              this.steps++;
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.randomSimulation = res;
              this.updateMarkers(this.randomSimulation.graph.nodeList);
              if (this.randomSimulation.simulationState === SimulationState.FINISHED) {
                this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 10000);
              }
            }, err => {
              console.log(err);
              this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
            });
        }
        break;

      case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
        if (this.randomWithLeaderSimulation.simulationState !== SimulationState.FINISHED) {
          const start = new Date();
          this.algorithmService.stepRandomWithLeader(this.randomWithLeaderSimulation)
            .subscribe(res => {
              this.steps++;
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.randomWithLeaderSimulation = res;
              this.updateMarkers(this.randomWithLeaderSimulation.graph.nodeList);
              if (this.randomWithLeaderSimulation.simulationState === SimulationState.FINISHED) {
                this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 10000);
              }
            }, err => {
              console.log(err);
              this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
            });
        }
        break;

      case AlgorithmType.ROTOR_ROUTER_DISPERSION:
        if (this.rotorRouterSimulation.simulationState !== SimulationState.FINISHED) {
          const start = new Date();
          this.algorithmService.stepRotorRouter(this.rotorRouterSimulation)
            .subscribe(res => {
              this.steps++;
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.rotorRouterSimulation = res;
              this.updateMarkers(this.rotorRouterSimulation.graph.nodeList);
              if (this.rotorRouterSimulation.simulationState === SimulationState.FINISHED) {
                this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 10000);
              }
            }, err => {
              console.log(err);
              this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
            });
        }
        break;

      case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
        if (this.rotorRouterWithLeaderSimulation.simulationState !== SimulationState.FINISHED) {
          const start = new Date();
          this.algorithmService.stepRotorRouterWithLeader(this.rotorRouterWithLeaderSimulation)
            .subscribe(res => {
              this.steps++;
              const end = new Date();
              this.RTT = end.valueOf() - start.valueOf();
              this.rotorRouterWithLeaderSimulation = res;
              this.updateMarkers(this.rotorRouterWithLeaderSimulation.graph.nodeList);
              if (this.rotorRouterWithLeaderSimulation.simulationState === SimulationState.FINISHED) {
                this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 10000);
              }
            }, err => {
              console.log(err);
              this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
            });
        }
        break;
    }
  }

  updateMarkers(nodes: Node[]): void {
    for (let i = 0; i < nodes.length; i++) {
      var icon;
      if (nodes[i].state === NodeState.DEFAULT) {
        icon = L.divIcon({
          iconSize: [25, 25],
          html:'<div style="border-radius: 50%; background-color: dodgerblue; justify-content: center; display: flex; align-items: center; color: white; width: 25px; height: 25px;"> ' + nodes[i].id + ' </div>',
          className: 'custom-marker-icon'
        });
      } else if (nodes[i].state === NodeState.PENDING) {
        icon = L.divIcon({
          iconSize: [25, 25],
          html:'<div style="border-radius: 50%; background-color: red; justify-content: center; display: flex; align-items: center; color: white; width: 25px; height: 25px;"> ' + nodes[i].id + ' </div>',
          className: 'custom-marker-icon'
        });
      } else if (nodes[i].state === NodeState.OCCUPIED) {
        icon = L.divIcon({
          iconSize: [25, 25],
          html:'<div style="border-radius: 50%; background-color: green; justify-content: center; display: flex; align-items: center; color: white; width: 25px; height: 25px;"> ' + nodes[i].id + ' </div>',
          className: 'custom-marker-icon'
        });
      }
      this.nodeMarkers[i].setIcon(icon);
    }
  }

  save(): void {
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isSaveDisabled(): boolean {
    if (this.algorithmType) {
      switch (this.algorithmType) {
        case AlgorithmType.RANDOM_DISPERSION:
          return !this.randomSimulation || this.randomSimulation.simulationState !== SimulationState.FINISHED;
        case AlgorithmType.RANDOM_WITH_LEADER_DISPERSION:
          return !this.randomWithLeaderSimulation || this.randomWithLeaderSimulation.simulationState !== SimulationState.FINISHED;
        case AlgorithmType.ROTOR_ROUTER_DISPERSION:
          return !this.rotorRouterSimulation || this.rotorRouterSimulation.simulationState !== SimulationState.FINISHED;
        case AlgorithmType.ROTOR_ROUTER_WITH_LEADER_DISPERSION:
          return !this.rotorRouterWithLeaderSimulation || this.rotorRouterWithLeaderSimulation.simulationState !== SimulationState.FINISHED;
      }
    } else {
      return true;
    }
  }

}
