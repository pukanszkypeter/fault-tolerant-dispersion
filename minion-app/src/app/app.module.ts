import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SimulationComponent } from './components/simulation/simulation.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { InformationPanelComponent } from './components/simulation/information-panel/information-panel.component';
import { InformationTableComponent } from './components/simulation/information-table/information-table.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/minions/home/home.component';
import { StaticComponent } from './components/playgrounds/static/static.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRippleModule } from "@angular/material/core";
import { SettingsDialogComponent } from './components/playgrounds/static/settings-dialog/settings-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    SimulationComponent,
    PageNotFoundComponent,
    InformationPanelComponent,
    InformationTableComponent,
    HomeComponent,
    StaticComponent,
    SettingsDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatRippleModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
