import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbDatosService } from '../services/db-datos.service'
import { tipoSolicitud } from '../interfaces/tipoSolicitud';
import { estatusSolicitud } from '../interfaces/estatusSolicitud'
import { asuntoSolicitud }  from '../interfaces/asuntoSolicitud';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { solicitudTransparencia } from '../interfaces/solicitudTransparencia';
import { totalesSolicitud } from '../interfaces/totalesSolicitud';
import { subTemas } from '../interfaces/subTemas';
import { temas } from '../interfaces/temas';
import { exportSolicitudes } from '../interfaces/expotSolicitudes';
import { exportSolicitudesDetalle } from '../interfaces/exportSolicitudesDetalle';
import  Swal  from 'sweetalert2'

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit, AfterViewInit  {

editando = false;
lbFecha = '';
lbHora = '';
lbMin = '';
miFoliocorreo:string = '';

minDate: Date = new Date('2022-01-01');
maxDate = '2023-01-01';

accionesPermitidas = 1;
horasDia:  string[] = [];
minutosHora:  string[] = [];
diasHabiles: string[] = [];

ItipoSolicitud: tipoSolicitud[] = [];
IestatusSolicitud: estatusSolicitud[] = [];
IasuntoSolicitud: asuntoSolicitud[] = [];
IexpSolicitudes: exportSolicitudes[]= [];
IexpSolicitudesDet: exportSolicitudesDetalle[] = [];

Itemas: temas[]= [];
IsubTemas: subTemas[] = [];

cont = 0;
url = 'https://localhost:3000/admin';
totalRegisPosSolicitud = 0;

estatusSolAct: string = "";


solTransTitulos: string[] = ['NO', 'UTAG', 'Folio', 'R-Revisión', 'Solicitud', 'Estatus', 'Límite', 'Gracia', 'Transcurridos', 'Solicitud_Terminada', 'Acciones'];

totalesSolicitudeTitulos: string[] = ['Total de solicitudes', 'Registrada y en trámite', 'Terminada',
                                      'Cancelada', 'Acciones'];

solTransDataSource = new MatTableDataSource<solicitudTransparencia>;
solTotalSolicitudes = new MatTableDataSource<totalesSolicitud>;

frmSolicitud = new FormGroup({
    fechaEnvUTAG: new FormControl('', Validators.required),
    horaEnvUTAG: new FormControl('', Validators.required),
    minutosEnvUTAG: new FormControl('', Validators.required),
    //fechaEnvOM: new FormControl(''),
    //horaEnvOM: new FormControl(''),
    //minutosEnvOM: new FormControl(''),
    folioSol: new FormControl('', [Validators.required, Validators.minLength(10)]),
    tipoSolicitud: new FormControl('', Validators.required),
    Solicitud: new FormControl('', Validators.required),
    estatusSol: new FormControl('', Validators.required),
    temaSol: new FormControl('', Validators.required),
    subTemaSol: new FormControl('', Validators.required),
//    asuntoSol: new FormControl('', Validators.required),
    observacionSol: new FormControl(''),
  });

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


    /** Define variables para el archivo de excel */
    fileName='ExelSheet.xlsx';
    title='Primer prueba';
    userList = [
      {
        "id":1,
        "name": "Carlitos",
        "username": "camaro",
      }
    ]


  constructor(private formBuilder: FormBuilder,
              private DbDatosService: DbDatosService,
              private http: HttpClient,
              private dt: DatePipe
              ) {
   }

  ngOnInit(): void {
    //this.minDate = this.dt.transform('2022-01-01', "yyyy-MM-dd");
    this.testLoop();
    this.getTransTipoSolicitud();
    this.getTransEstatusSolicitud();
    this.getTransAsuntoSolicitud();
    this.getAllSolicitudesTransparencia();
    this.geTotalesPorEstadistica();
    this.getAllTemasTransparencia()
  }

  geTotalesPorEstadistica() {
    this.DbDatosService.getTotalesPorSolicitud().subscribe(resultado => {
      this.solTotalSolicitudes = resultado;
      //console.log(resultado);
    })
  }

  navegacionFormulario (modulo: number): void  {
          //console.log(this.frmSolicitud.value.folioSol);
          this.accionesPermitidas = modulo;
    //console.log(this.accionesPermitidas);
  }

  valRegistro(){
    this.totalRegisPosSolicitud = 0;
    //console.log(this.frmSolicitud.value.folioSol);
    //console.log(this.frmSolicitud.value.estatusSol);
  const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    this.http.post(`${this.url}/trans/totalRegistros`,{
      folio: this.frmSolicitud.value.folioSol,
      estatus_solicitud_id: this.frmSolicitud.value.estatusSol
    },
    {headers: header}).subscribe((totRegSol: any) => {
      this.totalRegisPosSolicitud = totRegSol[0].total;
      //Swal.fire('Se guardo el registro de retrasos correctamente.', 'Presiona el botón para continuar!','success');
    });
  }

  insSolicitudes() {
    //console.log(this.frmSolicitud.value);
    //console.log(`${this.url}/trans/insSolicitud`);

    if (this.frmSolicitud.valid) {
      this.valRegistro();
      let fechaSis = new Date();

      setTimeout(() => {
        if(this.totalRegisPosSolicitud == 0 ) {
          //let fechaUTAG = new Date(this.frmSolicitud.value.fechaEnvUTAG, this.frmSolicitud.value.horaEnvUTAG, this.frmSolicitud.value.minutosEnvUTAG )
            const header = new HttpHeaders().set('Type-conten', 'aplication-json');
            this.http.post(`${this.url}/trans/insSolicitud`,{
              fecha_registro: this.dt.transform(fechaSis, "yyyy-MM-dd hh:mm"),
              fecha_UTAG: this.frmSolicitud.value.fechaEnvUTAG + ' ' + this.frmSolicitud.value.horaEnvUTAG + ':' + this.frmSolicitud.value.minutosEnvUTAG + ':00',
              //fecha_envioOM: this.frmSolicitud.value.fechaEnvOM + ' ' + this.frmSolicitud.value.horaEnvOM + ':' + this.frmSolicitud.value.minutosEnvOM + ':00',
              folio: this.frmSolicitud.value.folioSol,
              estatus_solicitud_id: this.frmSolicitud.value.estatusSol,
              tema_id: this.frmSolicitud.value.temaSol,
              subtema_id: this.frmSolicitud.value.subTemaSol,
              solicitud: this.frmSolicitud.value.Solicitud,
              tipo_Solicitud_id: this.frmSolicitud.value.tipoSolicitud,
              //asunto_id: this.frmSolicitud.value.asuntoSol,
              observaciones: this.frmSolicitud.value.observacionSol,
            },
            {headers: header}).subscribe((datosSolicitud: any) => {
              console.log('Se inserto el registro');
              console.log(datosSolicitud);
              this.getAllSolicitudesTransparencia()
              this.limpiaDatosformulario();
              Swal.fire('Se guardo un nuevo registro de solicitud de transparencia.', 'Presiona el botón para continuar!','success');
            });

        } else {
          const header = new HttpHeaders().set('Type-conten', 'aplication-json');
          this.http.post(`${this.url}/trans/updSolicitud`,{
            fecha_registro: this.dt.transform(fechaSis, "yyyy-MM-dd hh:mm"),
            fecha_UTAG: this.frmSolicitud.value.fechaEnvUTAG + ' ' + this.frmSolicitud.value.horaEnvUTAG + ':' + this.frmSolicitud.value.minutosEnvUTAG + ':00',
            folio: this.frmSolicitud.value.folioSol,
            estatus_solicitud_id: this.frmSolicitud.value.estatusSol,
            tema_id: this.frmSolicitud.value.temaSol,
            subtema_id: this.frmSolicitud.value.subTemaSol,
            solicitud: this.frmSolicitud.value.Solicitud,
            tipo_Solicitud_id: this.frmSolicitud.value.tipoSolicitud,
            //asunto_id: this.frmSolicitud.value.asuntoSol,
            observaciones: this.frmSolicitud.value.observacionSol,
          },
          {headers: header}).subscribe((datosUpdate: any) => {
                console.log('Se actualizó el registro');
                console.log(datosUpdate);
                Swal.fire('Se actualizó la solicitud de transparencia correctamente.', 'Presiona el botón para continuar!','success');
          });
          this.getAllSolicitudesTransparencia()
          this.limpiaDatosformulario();
        }
      }, 3000);
    } else
    {
      Swal.fire('Favor de completar todos los datos de la solicitud de transparencia correctamente.', 'Presiona el botón para continuar!','error');
    }
    }

  testLoop(){
    do {
      if(this.cont < 24){
        if( this.cont < 10){
          this.horasDia.push('0' + this.cont.toString());
          this.minutosHora.push('0' + this.cont.toString());
          this.diasHabiles.push('0' + this.cont.toString());
        } else {
          this.horasDia.push(this.cont.toString());
          this.minutosHora.push(this.cont.toString());
          this.diasHabiles.push(this.cont.toString());
        }
      } else {
        if(this.cont < 31) {
          this.diasHabiles.push(this.cont.toString());
          this.minutosHora.push(this.cont.toString());
        }
        this.minutosHora.push(this.cont.toString());
      }
      this.cont++;
    }
    while (this.cont < 60);
    //console.log(this.horasDia);
  }

  getTransTipoSolicitud() {
    this.DbDatosService.getTransTipoSolicitud().subscribe(resultado => {
      this.ItipoSolicitud = resultado;

      //console.log(resultado);
    })
  }

  getTransEstatusSolicitud() {
    this.DbDatosService.getTransEstatusSolicitud().subscribe(resultado => {
      this.IestatusSolicitud = resultado;
      this.IestatusSolicitud = this.IestatusSolicitud.filter(dato => dato.clave === 'REG');
      console.log(this.IestatusSolicitud);
    })
  }

  getTransAsuntoSolicitud() {
    this.DbDatosService.getTransAsuntoSolicitud().subscribe(resultado => {
      this.IasuntoSolicitud = resultado;
      //console.log(resultado);
    })
  }

  getAllSolicitudesTransparencia() {
    this.DbDatosService.getTransAllSolicitudes().subscribe(resultado => {
      this.solTransDataSource = new MatTableDataSource(resultado);
      this.solTransDataSource.paginator = this.paginator;
      this.solTransDataSource.sort = this.sort;
    })
  }

  ngAfterViewInit() {

  }

  obtieneRegistroSeleccionado(regSeleccionado: any) {
    console.log(regSeleccionado);
    this.editando = true;
    //console.log(this.editando);
    this.frmSolicitud.patchValue({
      temaSol: regSeleccionado.tema_id,
    })
    this.getSubTema();

    const resultado = this.ItipoSolicitud.find(element => element.solicitud === regSeleccionado.Solicitud);
    this.frmSolicitud.patchValue({
      tipoSolicitud: resultado?.id.toString(),
    });

    this.miFoliocorreo = regSeleccionado.Folio;
    this.lbFecha = regSeleccionado.UTAG.substring(0,2) + '/' + regSeleccionado.UTAG.substring(3,5) + '/' +  regSeleccionado.UTAG.substring(6,10);
    this.lbHora = regSeleccionado.UTAG.substring(11,13);
    this.lbMin = regSeleccionado.UTAG.substring(14,17);

    this.frmSolicitud.patchValue({
      fechaEnvUTAG: regSeleccionado.UTAG.substring(6,10) + '-' + regSeleccionado.UTAG.substring(3,5) + '-' + regSeleccionado.UTAG.substring(0,2),
      horaEnvUTAG: regSeleccionado.UTAG.substring(11,13),
      minutosEnvUTAG: regSeleccionado.UTAG.substring(14,17),
      Solicitud: regSeleccionado.solicitud,
      folioSol: regSeleccionado.Folio,
      estatusSol: regSeleccionado.estatus_solicitud_id,
      subTemaSol: regSeleccionado.subtema_id,
      //asuntoSol: regSeleccionado.asunto_id,
      observacionSol: regSeleccionado.observaciones,
    });
    //this.frmSolicitud.get('fechaEnvUTAG').disable();
    console.log( this.frmSolicitud);
  }

  limpiaDatosformulario(){
    this.frmSolicitud.patchValue({
      fechaEnvUTAG: '',
      horaEnvUTAG: '',
      minutosEnvUTAG: '',
      Solicitud: '',
      tipoSolicitud: '',
      folioSol: '',
      estatusSol: '',
      temaSol: '',
      subTemaSol: '',
      //asuntoSol: '',
      observacionSol: '',
    });
    this.editando = false;
  }

  getAllTemasTransparencia() {
    this.DbDatosService.getAllTemas().subscribe(resultado => {
      this.Itemas = resultado;
    })
  }

  getSubTema() {
    console.log(this.frmSolicitud.value.temaSol);
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    this.http.post(`${this.url}/trans/getAllSubtemas`,{
      tema_id: this.frmSolicitud.value.temaSol,
    },
    {headers: header}).subscribe((datosSubtema: any) => {
      console.log(datosSubtema);
      this.IsubTemas = datosSubtema;
    });
  }

/*  */
  applyFilter(event: Event, tabla: number) {
    const filterValue = (event.target as HTMLInputElement).value;
    //console.log(filterValue);
    //console.log(this.solTransDataSource);
        switch (tabla) {
          case 1: {
            this.solTransDataSource.filter = filterValue.trim().toLowerCase();
              if (this.solTransDataSource.paginator) {
                this.solTransDataSource.paginator.firstPage();
              }
              break;
            }
}
    }

    exportaDatosExcel() {

        this.DbDatosService.expAllSolicitudes().subscribe(resExpSol => {
          this.IexpSolicitudes = resExpSol;
        });

      this.DbDatosService.expAllSolicitudesDetalle().subscribe(resExpSolDet => {
        this.IexpSolicitudesDet = resExpSolDet;
      });

    setTimeout(() => {
      this.DbDatosService.exportarAExcel(this.IexpSolicitudes,
                                          this.IexpSolicitudesDet,
                                          'datosSolicitudes.xlsx');
    }, 5000);
  }
          //this.DbDatosService.exportarAExcel(this.solTransDataSource.data, this.solTransDataSource.data, 'datosSolicitudes.xlsx');

     exportaDatosFiltradosExcel() {

      this.DbDatosService.exportarAExcel(this.solTransDataSource.filteredData, this.solTotalSolicitudes.data, 'Solicitudes');
      //solTotalSolicitudes = new MatTableDataSource<totalesSolicitud>;


      /* primera prueba código si funciona
      let element = document.getElementById('excel-table');
      console.log(element);
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(element);
      console.log(ws);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.fileName);
      */
     }

}

