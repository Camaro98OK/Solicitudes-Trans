import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetrasosDatosComponent } from './retrasos-datos/retrasos-datos.component'
import { RetrasosComponent } from './retrasos.component';

const routes: Routes = [
  {path: 'datos2021Ene', component: RetrasosComponent},
  {path: 'datos2021Feb', component: RetrasosDatosComponent},
];

//{path: 'create', component: IndicadoresComponent},
//{path: 'PMCI01',  component: IndicadoresListComponent},


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetrasosRoutingModule { }
