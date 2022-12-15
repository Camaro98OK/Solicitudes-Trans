import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbDatosService } from '../../services/db-datos.service'
import { DatePipe } from '@angular/common';
import { remitentes } from '../../interfaces/remitentes';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { areasTrasparencia } from '../../interfaces/areas';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-remitente',
  templateUrl: './remitente.component.html',
  styleUrls: ['./remitente.component.scss']
})
export class RemitenteComponent implements OnInit {

  @Output() regresaCorreo = new EventEmitter<number>();

  accionesPermitidas = 1;
  url = 'https://localhost:3000/admin';
  idRemitenteSeleccionado = 0;
  Iremitentes: remitentes[] = [];
  remitentesTitulos: string[] = ['Nombre', 'Estatus', 'Area', 'Acciones'];
  remitentesDataSource = new MatTableDataSource<remitentes>;
  IareasTransparencia: areasTrasparencia[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmRemitente = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    area_id: new FormControl('', Validators.required),
    estatus_id: new FormControl('', Validators.required),
  });

  constructor(private formBuilder: FormBuilder,
    private DbDatosService: DbDatosService,
    private http: HttpClient,
    private dt: DatePipe) { }

  ngOnInit(): void {
    this.getAllRemitentes();
    this.getAllAreasTrans();
  }

  getAllRemitentes() {
    this.DbDatosService.getAllRemitentes().subscribe(resultado => {
      this.Iremitentes = resultado;
      this.remitentesDataSource = new MatTableDataSource(resultado);
      this.remitentesDataSource.paginator = this.paginator
      this.remitentesDataSource.sort = this.sort;
    })
  }

  putRemitente() {
    console.log(this.frmRemitente.value);
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    if(this.idRemitenteSeleccionado === 0) {
//          console.log('Entro en el insert');
//          console.log(this.idRemitenteSeleccionado);
          this.http.post(`${this.url}/trans/putRemitente`,{
            nombre: this.frmRemitente.value.nombre,
            area_id: this.frmRemitente.value.area_id,
            estatus_id: this.frmRemitente.value.estatus_id,
          },
          {headers: header}).subscribe((datosRemitente: any) => {
            this.setLimpiaRemitente();
            this.getAllRemitentes();
            Swal.fire('Se guardo el registro del remitente satisfactoriamente.', 'Presiona el botón para continuar!','success');
          });
    } else {
//      console.log('Entro en el update');
//      console.log(this.idRemitenteSeleccionado);
        this.http.post(`${this.url}/trans/updRemitente`,{
          id: this.idRemitenteSeleccionado,
          nombre: this.frmRemitente.value.nombre,
          area_id: this.frmRemitente.value.area_id,
          estatus_id: this.frmRemitente.value.estatus_id,
        },
        {headers: header}).subscribe((datosRemitente: any) => {
          this.setLimpiaRemitente();
          this.getAllRemitentes();
          Swal.fire('Se actualizó el registro del remitente satisfactoriamente.', 'Presiona el botón para continuar!','success');
        });
    };
  }

  setLimpiaRemitente() {
    this.frmRemitente.patchValue ({
      nombre: '',
      area_id: '',
      estatus_id: '',
    });
    this.idRemitenteSeleccionado = 0;
  }

  obtieneRemitenteSeleccionado(datosRemitente: any) {
    console.log(datosRemitente)
    this.frmRemitente.patchValue ({
      nombre: datosRemitente.Nombre,
      area_id: datosRemitente.area_id,
      estatus_id: datosRemitente.estatus_id,
    });
    this.idRemitenteSeleccionado = datosRemitente.id;
  }

  getAllAreasTrans() {
    this.DbDatosService.getAllAreasTransparencia().subscribe(resultado => {
      this.IareasTransparencia = resultado;
    })
  }

  navegacionFormulario (modulo: number): void  {
    this.regresaCorreo.emit(modulo);
     //this.accionesPermitidas = modulo;
  }

  applyFilter(event: Event, tabla: number) {
    const filterValue = (event.target as HTMLInputElement).value;
    //console.log(filterValue);
    //console.log(this.solTransDataSource);
        switch (tabla) {
          case 3: {
            console.log(' entro en el 3')

            this.remitentesDataSource.filter = filterValue.trim().toLowerCase();
            if (this.remitentesDataSource.paginator) {
              this.remitentesDataSource.paginator.firstPage();
            }
              break;
          }
}
    }
}
