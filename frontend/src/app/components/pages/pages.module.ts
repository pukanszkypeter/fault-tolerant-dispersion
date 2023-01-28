import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared.module";
import { ChangelogComponent } from "./changelog/changelog.component";
import { HomeComponent } from "./home/home.component";
import { MapSimulatorComponent } from "./map-simulator/map-simulator.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ResultsComponent } from "./results/results.component";
import { SimulatorComponent } from "./simulator/simulator.component";
import { TesterComponent } from "./tester/tester.component";

@NgModule({
  imports: [SharedModule],
  declarations: [
    ChangelogComponent,
    HomeComponent,
    MapSimulatorComponent,
    PageNotFoundComponent,
    ResultsComponent,
    SimulatorComponent,
    TesterComponent,
  ],
  exports: [
    ChangelogComponent,
    HomeComponent,
    MapSimulatorComponent,
    PageNotFoundComponent,
    ResultsComponent,
    SimulatorComponent,
    TesterComponent,
  ],
})
export class PagesModule {}
