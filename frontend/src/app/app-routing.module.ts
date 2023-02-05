import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChangelogComponent } from "./components/pages/changelog/changelog.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { PageNotFoundComponent } from "./components/pages/page-not-found/page-not-found.component";
import { ResultsComponent } from "./components/pages/results/results.component";
import { SimulatorComponent } from "./components/pages/simulator/simulator.component";
import { TesterComponent } from "./components/pages/tester/tester.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "simulator", component: SimulatorComponent },
  { path: "tester", component: TesterComponent },
  { path: "results", component: ResultsComponent },
  { path: "changelog", component: ChangelogComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
