import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetrasosComponent } from './retrasos.component'
import { RetrasosRoutingModule } from './retrasos-routing.module';
import { RetrasosDatosComponent } from './retrasos-datos/retrasos-datos.component';


@NgModule({
  declarations: [
    RetrasosComponent,
    RetrasosDatosComponent,
  ],
  imports: [
    CommonModule,
    RetrasosRoutingModule
  ]
})
export class RetrasosModule { }
