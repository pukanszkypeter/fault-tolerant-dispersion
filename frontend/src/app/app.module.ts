import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material/material.module";
import { LayoutComponent } from "./components/layout/layout.component";
import { HeaderComponent } from "./components/layout/header/header.component";
import { FooterComponent } from "./components/layout/footer/footer.component";
import { MainComponent } from "./components/layout/main/main.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { SimulatorComponent } from "./components/pages/simulator/simulator.component";
import { TesterComponent } from "./components/pages/tester/tester.component";
import { ChangelogComponent } from "./components/pages/changelog/changelog.component";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { MapSimulatorComponent } from "./components/pages/map-simulator/map-simulator.component";
import { ResultsComponent } from "./components/pages/results/results.component";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    HomeComponent,
    SimulatorComponent,
    TesterComponent,
    ChangelogComponent,
    PageNotFoundComponent,
    MapSimulatorComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
