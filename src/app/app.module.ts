import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './body/body.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatosDashboardComponent } from './dashboard/datos-dashboard/datos-dashboard.component';
import { RemitenteComponent } from './dashboard/remitente/remitente.component';
import { DestinatarioComponent } from './dashboard/destinatario/destinatario.component';
import { AsuntoComponent } from './dashboard/asunto/asunto.component';
import { SeguimientoComponent } from './dashboard/seguimiento/seguimiento.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    HeaderComponent,
    SidenavComponent,
    DashboardComponent,
    AdminComponent,
    SublevelMenuComponent,
    DatosDashboardComponent,
    RemitenteComponent,
    DestinatarioComponent,
    AsuntoComponent,
    SeguimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
