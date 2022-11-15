import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
// Utils
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MarkdownModule } from 'ngx-markdown';
import { SecurityContext } from '@angular/core';
// Components
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { SimulatorComponent } from './components/pages/simulator/simulator.component';
import { GraphConfigurationComponent } from './components/pages/simulator/graph-configuration/graph-configuration.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { AutomatedTesterComponent } from './components/pages/automated-tester/automated-tester.component';
import { AutomatedTesterSettingsComponent } from './components/pages/automated-tester/automated-tester-settings/automated-tester-settings.component';
import { AlgorithmConfigurationComponent } from './components/pages/simulator/algorithm-configuration/algorithm-configuration.component';
import { VisualizationComponent } from './components/pages/visualization/visualization.component';
import { LogFormComponent } from './components/pages/simulator/log-form/log-form.component';
import { OpenStreetMapComponent } from './components/pages/open-street-map/open-street-map.component';
import { AlgorithmSelectDialogComponent } from './components/pages/open-street-map/algorithm-select-dialog/algorithm-select-dialog.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { ChangelogComponent } from './components/pages/changelog/changelog.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SimulatorComponent,
    GraphConfigurationComponent,
    LayoutComponent,
    SettingsComponent,
    AutomatedTesterComponent,
    AutomatedTesterSettingsComponent,
    AlgorithmConfigurationComponent,
    LogFormComponent,
    VisualizationComponent,
    OpenStreetMapComponent,
    AlgorithmSelectDialogComponent,
    DashboardComponent,
    ProfileComponent,
    ChangelogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
