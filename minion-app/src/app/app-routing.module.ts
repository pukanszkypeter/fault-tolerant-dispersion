import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {HomeComponent} from "./components/home/home.component";
import {StaticComponent} from "./components/static/static.component";
import {SimulationComponent} from "./components/simulation/simulation.component";
import {AutomatedTestComponent} from "./components/automated-test/automated-test.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'simulation/2.0', component: StaticComponent},
  { path: 'simulation/1.0', component: SimulationComponent},
  { path: 'test', component: AutomatedTestComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
