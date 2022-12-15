import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbDatosService } from '../../services/db-datos.service'
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { seguimientoSolicitud } from '../../interfaces/seguimientoSolicitud';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent implements OnInit {
  @Output() regresaSeguimiento = new EventEmitter<number>();
  //@Output() actualizaCatalogo = new EventEmitter<number>();

  url = 'https://localhost:3000/admin';
  idRegistroSeleccionado = 0;
  Iseguimiento: seguimientoSolicitud[] = [];
  seguimientoTransDataSource = new MatTableDataSource<seguimientoSolicitud>;

  areasTitulos: string[] = ['solicitud_dsc', 'orden', 'Acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmSeguimiento = new FormGroup({
    id:  new FormControl(''),
    solicitud_dsc:  new FormControl('', Validators.required),
    orden:  new FormControl('', Validators.required),
  });

  constructor(private formBuilder: FormBuilder,
    private DbDatosService: DbDatosService,
    private http: HttpClient,
    private dt: DatePipe) { }

  ngOnInit(): void {
    this.getAllSeguimiento();
  }

  getAllSeguimiento() {
    this.DbDatosService.getAllSeguimiento().subscribe(resultado  => {
      this.Iseguimiento = resultado;
      this.seguimientoTransDataSource = new MatTableDataSource(resultado);
      this.seguimientoTransDataSource.paginator = this.paginator
      this.seguimientoTransDataSource.sort = this.sort;
    })
  }


  setLimpiaSeguimiento() {
    this.frmSeguimiento.patchValue ({
      solicitud_dsc: '',
      orden: '',
    });
    this.idRegistroSeleccionado = 0;
  }


  putAreasSeguimiento() {
    //console.log(this.frmSeguimiento.value);
    const header = new HttpHeaders().set('Type-content', 'application-json');
    if(this.idRegistroSeleccionado == 0 ) {
        this.http.post(`${this.url}/trans/putSeguimientoAreas`,{
                  seguimiento: this.frmSeguimiento.value.solicitud_dsc,
                  orden: this.frmSeguimiento.value.orden
        },
        {headers: header}).subscribe((datosAsunto: any) => {
          this.getAllSeguimiento();
          this.setLimpiaSeguimiento();
          Swal.fire('Se guardo el registro de seguimiento entre áreas satisfactoriamente.', 'Presiona el botón para continuar!','success');
        })
    } else {
      this.http.post(`${this.url}/trans/updSegumientoAreas`,{
        id: this.idRegistroSeleccionado,
        seguimiento: this.frmSeguimiento.value.solicitud_dsc,
        orden: this.frmSeguimiento.value.orden
      },
      {headers: header}).subscribe((datosAsunto: any) => {
        this.getAllSeguimiento();
        this.setLimpiaSeguimiento();
        Swal.fire('Se actializó el registro de seguimiento entre áreas satisfactoriamente.', 'Presiona el botón para continuar!','success');
      })
    }
  }

  obtieneRegistroSeleccionado(datosRegistro: any) {
    //console.log(datosRegistro)
    this.frmSeguimiento.patchValue ({
      id: datosRegistro.id,
      solicitud_dsc: datosRegistro.solicitud_dsc,
      orden: datosRegistro.orden,
    });
    this.idRegistroSeleccionado = datosRegistro.id;
  }

  navegacionFormulario (modulo: number): void  {
    this.regresaSeguimiento.emit(modulo);
    //this.actualizaCatalogo.emit(6);
     //this.accionesPermitidas = modulo;
  }

  applyFilter(event: Event, tabla: number) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.seguimientoTransDataSource.filter = filterValue.trim().toLowerCase();
    if (this.seguimientoTransDataSource.paginator) {
      this.seguimientoTransDataSource.paginator.firstPage();
    }
  }
}
