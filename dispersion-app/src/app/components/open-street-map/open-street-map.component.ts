import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SnackbarService } from 'src/app/services/client-side/utils/snackbar.service';
import { OpenStreetMapService } from 'src/app/services/server-side/open-street-map/open-street-map.service';
import { icon, Marker } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Node, NodeState } from 'src/app/models/entities/Node';
import { Edge } from 'src/app/models/entities/Edge';
import { Robot, RobotState } from 'src/app/models/entities/Robot';
import { AlgorithmSelectDialogComponent } from './algorithm-select-dialog/algorithm-select-dialog.component';
import { SimulationState } from 'src/app/models/entities/SimulationState';
import { AlgorithmService } from 'src/app/services/server-side/algorithms/algorithm.service';

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
  robots: Robot[] = [];

  selectedNodeID = 0;
  algorithmType = '';

  // Simulator
  simulationState: SimulationState;
  speed: number = 750;
  steps: number = 0;
  RTT: number = 0;
  STOPPED = false;

  constructor(
              private openStreetMapService: OpenStreetMapService,
              private snackBarService: SnackbarService,
              private algorithmService: AlgorithmService,
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
    this.simulationState = undefined;
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

        var defaultIcon = L.icon({
          iconUrl: 'assets/images/blue-dot.png',
          iconSize: [25, 25],
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

        this.edges.push(new Edge(edge.id, edge.fromID, edge.toID, 'black'));
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
        this.simulationState = new SimulationState().init({nodes: this.nodes, edges: this.edges, robots: this.robots, counter: this.nodes.length});
      }
    });
  }

  getRobots(): number {
    return this.robots.filter(robot => robot.onID === this.selectedNodeID).length;
  }

  addRobot(): void {
    this.robots.push(new Robot(1, this.selectedNodeID, RobotState.SEARCHING, 'black', 0));
    
    const robots = this.getRobots();
    if (robots === 1) {
      var pendingIcon = L.icon({
        iconUrl: 'assets/images/red-dot.png',
        iconSize: [25, 25],
      });
      this.nodeMarkers[this.selectedNodeID - 1].setIcon(pendingIcon);
    }

  }

  removeRobot(): void {
    const index = this.robots.findIndex(robot => robot.onID === this.selectedNodeID);
    if (index > -1) {
      this.robots.splice(index, 1);
    }
    const robots = this.getRobots();
    if (robots === 0) {
      var defaultIcon = L.icon({
        iconUrl: 'assets/images/blue-dot.png',
        iconSize: [25, 25],
      });
      this.nodeMarkers[this.selectedNodeID - 1].setIcon(defaultIcon);
    }
  }

  async playSimulator(): Promise<void> {
    this.STOPPED = false;
    while (!this.STOPPED && this.simulationState.counter !== 0 && !this.allRobotFinished()) {
      await this.stepSimulator();
      await this.sleep(this.speed);
    }
  }

  stopSimulator(): void {
    this.STOPPED = true;
  }

  async stepSimulator(): Promise<void> {
    if (this.simulationState.counter !== 0 && !this.allRobotFinished()) {
      const start = new Date();
      this.algorithmService
        .step(this.algorithmType, this.simulationState)
        .subscribe(res => {
          this.steps++;
          const end = new Date();
          this.RTT = end.valueOf() - start.valueOf();
          this.simulationState = new SimulationState().init(res);
          // TO-DO
          this.updateMarkers(this.simulationState.nodes);
          if (this.simulationState.counter === 0) {
            this.snackBarService.openSnackBar('SIMULATION_FINISHED', 'success-snackbar', null, null, null, 10000);
          } else if (this.allRobotFinished()) {
            this.snackBarService.openSnackBar('SIMULATION_STUCK', 'warning-snackbar', null, null, null, 10000);
          }
        }, err => {
          console.log(err);
          this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        });
    }
  }

  updateMarkers(nodes: Node[]): void {
    for (let i = 0; i < nodes.length; i++) {
      var icon;
      if (nodes[i].state === NodeState.DEFAULT) {
        icon = L.icon({
          iconUrl: 'assets/images/blue-dot.png',
          iconSize: [25, 25],
        });
      } else if (nodes[i].state === NodeState.PENDING) {
        icon = L.icon({
          iconUrl: 'assets/images/red-dot.png',
          iconSize: [25, 25],
        });
      } else if (nodes[i].state === NodeState.OCCUPIED) {
        icon = L.icon({
          iconUrl: 'assets/images/green-dot.png',
          iconSize: [25, 25],
        });
      }
      this.nodeMarkers[i].setIcon(icon);
    }
  }

  save(): void {

  }

  allRobotFinished(): boolean {
    return this.simulationState.robots.filter(r => r.state === RobotState.FINISHED).length === this.simulationState.robots.length;
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
