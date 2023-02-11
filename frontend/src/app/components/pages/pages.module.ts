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
  ],
  exports: [
    ChangelogComponent,
    HomeComponent,
    PageNotFoundComponent,
    ResultsComponent,
    SimulatorComponent,
    TesterComponent,
  ],
})
export class PagesModule {}
