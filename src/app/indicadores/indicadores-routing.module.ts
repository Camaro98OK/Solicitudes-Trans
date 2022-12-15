import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicadoresListComponent } from './indicadores-list/indicadores-list.component';
import { IndicadoresComponent } from './indicadores.component'

const routes: Routes = [
  {path: 'PMCI01', component: IndicadoresComponent},
  {path: 'PMCI02',  component: IndicadoresListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class IndicadoresRoutingModule { }
