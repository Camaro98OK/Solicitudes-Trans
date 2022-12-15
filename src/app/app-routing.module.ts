import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { RetrasosComponent } from './retrasos/retrasos.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'indiSIER', loadChildren: () => import('./indicadores/indicadores.module')
        .then(m => m.IndicadoresModule) },
  {path: 'retrasosSIER', loadChildren: () => import('./retrasos/retrasos.module')
        .then(m => m.RetrasosModule)}
];
  //{path: 'adminSIER', component: AdminComponent},
  //{path: 'retrasosSIER', component: RetrasosComponent},


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
