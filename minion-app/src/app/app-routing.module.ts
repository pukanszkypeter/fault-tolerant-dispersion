import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {HomeComponent} from "./components/minions/home/home.component";
import {StaticComponent} from "./components/playgrounds/static/static.component";
import {SimulationComponent} from "./components/simulation/simulation.component";

const routes: Routes = [
  { path: '', redirectTo: 'minions/home', pathMatch: 'full' },
  { path: 'minions/home', component: HomeComponent },
  { path: 'playgrounds/static', component: StaticComponent},
  { path: 'category/easter-egg', component: SimulationComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
