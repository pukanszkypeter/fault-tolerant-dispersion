import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SnackbarService } from 'src/app/services/client-side/utils/snackbar.service';
import { OpenStreetMapService } from 'src/app/services/server-side/open-street-map/open-street-map.service';
import { icon, Marker } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

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

  constructor(
              private openStreetMapService: OpenStreetMapService,
              private snackBarService: SnackbarService,
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
    this.polygonMarkers = [];
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
      // To-Do
      console.log(res);
    }, err => {
      console.log(err);
      this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
      this.loading = false;
    });
  }

}
