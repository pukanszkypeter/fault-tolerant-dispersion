import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared.module";
import { ChangelogComponent } from "./changelog/changelog.component";
import { HomeComponent } from "./home/home.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ResultsComponent } from "./results/results.component";
import { SimulatorComponent } from "./simulator/simulator.component";
import { TesterComponent } from "./tester/tester.component";
import { GraphConfigDialogComponent } from "./simulator/graph-config-dialog/graph-config-dialog.component";
import { AlgorithmConfigDialogComponent } from "./simulator/algorithm-config-dialog/algorithm-config-dialog.component";
import { PageNotSupportedComponent } from "./page-not-supported/page-not-supported.component";
import { SettingsConfigDialogComponent } from "./simulator/settings-config-dialog/settings-config-dialog.component";
import { FaultsConfigDialogComponent } from "./simulator/faults-config-dialog/faults-config-dialog.component";
import { DiagramsComponent } from "./results/diagrams.component";

@NgModule({
  imports: [SharedModule],
  declarations: [
    ChangelogComponent,
    HomeComponent,
    PageNotFoundComponent,
    ResultsComponent,
    SimulatorComponent,
    TesterComponent,
    GraphConfigDialogComponent,
    AlgorithmConfigDialogComponent,
    PageNotSupportedComponent,
    SettingsConfigDialogComponent,
    FaultsConfigDialogComponent,
    DiagramsComponent,
  ],
  exports: [
    ChangelogComponent,
    HomeComponent,
    PageNotFoundComponent,
    PageNotSupportedComponent,
    ResultsComponent,
    SimulatorComponent,
    TesterComponent,
  ],
})
export class PagesModule {}
