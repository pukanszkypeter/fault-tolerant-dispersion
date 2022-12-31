import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { SimulatorComponent } from './components/pages/simulator/simulator.component';
import { AutomatedTesterComponent } from './components/pages/automated-tester/automated-tester.component';
import { VisualizationComponent } from './components/pages/visualization/visualization.component';
import { OpenStreetMapComponent } from './components/pages/open-street-map/open-street-map.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ChangelogComponent } from './components/pages/changelog/changelog.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'simulator', component: SimulatorComponent },
  { path: 'tester', component: AutomatedTesterComponent },
  { path: 'results', component: VisualizationComponent },
  { path: 'open-street-map', component: OpenStreetMapComponent },
  { path: 'changelog', component: ChangelogComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
