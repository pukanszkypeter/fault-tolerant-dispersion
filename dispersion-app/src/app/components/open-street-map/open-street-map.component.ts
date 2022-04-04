import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import * as L from 'leaflet';
import { SnackbarService } from 'src/app/services/client-side/utils/snackbar.service';
import { OpenStreetMapService } from 'src/app/services/server-side/open-street-map/open-street-map.service';
import { icon, Marker } from 'leaflet';
import { MatChipInputEvent } from '@angular/material/chips';

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
  private centroid: L.LatLngExpression = [47.497913, 19.040236]; // Budapest

  loading = false;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  locations: any[] = [];
  markers: any[] = [];

  constructor(
              private openStreetMapService: OpenStreetMapService,
              private snackBarService: SnackbarService
              ) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
    }).setView(this.centroid, 8);

    const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    layer.addTo(this.map);
  
    const onMapClick = (event: any) => {
      this.loading = true;
      this.openStreetMapService.findLocation(event.latlng).subscribe(res => {
        if (res === null) {
          this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        } else {
          if (!this.containsLocation(this.locations, res)) {
            this.locations.push(res);
            var marker = L.marker([res.lat, res.lng], {title: res.location});
            marker.addTo(this.map);
            this.markers.push(marker);
          }
        }
        this.loading = false;
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        this.loading = false;
      });
    }
    
    this.map.on('click', onMapClick);
  
  }

  containsLocation(locations: any[], location: any): boolean {
    var i;
    for (i = 0; i < locations.length; i++) {
      if (locations[i].location === location.location) {
        return true;
      }
    }

    return false;
  }

  addLocation(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value !== '') {
      this.loading = true;
      this.openStreetMapService.findCity(value).subscribe(res => {
        if (res == null) {
          this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        } else {
          if (!this.containsLocation(this.locations, res)) {
            this.locations.push(res);
            var marker = L.marker([res.lat, res.lng], {title: res.location});
            marker.addTo(this.map);
            this.markers.push(marker);
          }
        }
        this.loading = false;
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        this.loading = false;
      })
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeLocation(location: any): void {
    const index = this.locations.indexOf(location);

    if (index > -1) {
      this.locations.splice(index, 1);
      this.map.removeLayer(this.markers[index]);
      this.markers.splice(index, 1);
    }
  }

}
