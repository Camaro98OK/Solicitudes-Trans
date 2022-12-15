import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicadoresRoutingModule } from './indicadores-routing.module';
import { IndicadoresComponent } from './indicadores.component';
import { IndicadoresListComponent } from './indicadores-list/indicadores-list.component';

@NgModule({
  declarations: [
    IndicadoresComponent,
    IndicadoresListComponent
  ],
  imports: [
    CommonModule,
    IndicadoresRoutingModule
  ]
})
export class IndicadoresModule { }
