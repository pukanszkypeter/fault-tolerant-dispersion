import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import * as L from 'leaflet';
import { SnackbarService } from 'src/app/services/client-side/utils/snackbar.service';
import { OpenStreetMapService } from 'src/app/services/server-side/open-street-map/open-street-map.service';
import { icon, Marker } from 'leaflet';
import { MatDialog } from '@angular/material/dialog';
import { LocationFormComponent } from './location-form/location-form.component';

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
              private snackBarService: SnackbarService,
              public dialog: MatDialog
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
        this.loading = false;
        const dialogRef = this.dialog.open(LocationFormComponent, {
          data: res,
          height: "50%",
          width: "30%",
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(res => {
          if (res && Object.keys(res).length !== 0) {
            this.locations.push(res);
            var marker = L.marker([event.latlng.lat, event.latlng.lng], {title: this.getLocationTitle(res)});
            marker.addTo(this.map);
            this.markers.push(marker);
          }
        });
      }, err => {
        console.log(err);
        this.snackBarService.openSnackBar('SERVER_ERROR', 'error-snackbar');
        this.loading = false;
      });
    }
    
    this.map.on('click', onMapClick);
  
  }

  getLocationTitle(location: any): string {
    let values = Object.values(location);
    let result = '';
    for (let i = 0; i < values.length; i++) {
      result = result + values[i] + ', ';
    }
    result = result.slice(0, -2);

    return result;
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
