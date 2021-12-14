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
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { SimulatorComponent } from './components/simulator/simulator.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRippleModule } from "@angular/material/core";
import { GraphConfigurationComponent } from './components/simulator/graph-configuration/graph-configuration.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatSliderModule } from "@angular/material/slider";
import { LayoutComponent } from './components/layout/layout.component';
import { SettingsComponent } from './components/layout/settings/settings.component'

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import { AutomatedTesterComponent } from './components/automated-tester/automated-tester.component';
import { AutomatedTesterSettingsComponent } from './components/automated-tester/automated-tester-settings/automated-tester-settings.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatChipsModule} from "@angular/material/chips";
import { AlgorithmConfigurationComponent } from './components/simulator/algorithm-configuration/algorithm-configuration.component';
import { LogFormComponent } from './components/simulator/log-form/log-form.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    SimulatorComponent,
    GraphConfigurationComponent,
    LayoutComponent,
    SettingsComponent,
    AutomatedTesterComponent,
    AutomatedTesterSettingsComponent,
    AlgorithmConfigurationComponent,
    LogFormComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
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
        MatDialogModule,
        MatSnackBarModule,
        MatCardModule,
        MatSliderModule,
        MatTableModule,
        MatDividerModule,
        MatGridListModule,
        MatChipsModule,
        MatProgressBarModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
