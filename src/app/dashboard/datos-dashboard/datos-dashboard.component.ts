import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { DbDatosService } from '../../services/db-datos.service'
import { DatePipe } from '@angular/common';

import { tipoCorreo } from '../../interfaces/tipoCorreo';
import { remitentes } from '../../interfaces/remitentes';
import { correoSolicitud } from '../../interfaces/correoSolicitud';
import { asunto } from '../../interfaces/asunto';
import { destinatario } from '../../interfaces/destinatario';
import { seguimientoSolicitud } from '../../interfaces/seguimientoSolicitud';
import { areasTrasparencia } from '../../interfaces/areas';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-dashboard',
  templateUrl: './datos-dashboard.component.html',
  styleUrls: ['./datos-dashboard.component.scss']
})
export class DatosDashboardComponent implements OnInit {

  @Output() regresoPrincipal = new EventEmitter<number>();

  @Input() folPadre: string = '';
  @Input() moduloSeleccionado: number = 0;

  folioSolAct: string = '';
  idCorreoSolicitud = 0;
  miFoliocorreo:string = '';

  horasDia:  string[] = [];
  minutosHora:  string[] = [];
  diasHabiles: string[] = [];

  cont = 0;
  url = 'https://localhost:3000/admin';
  editando = false;


  ItipoCorreo: tipoCorreo[] = [];
  Iasunto: asunto[] = [];
  Iremitentes: remitentes[] = [];
  Idestinatario: destinatario[] = [];
  Iseguimiento: seguimientoSolicitud[] = [];
  IareasTransparencia: areasTrasparencia[] = [];


  correosTitulos: string[] = ['Folio', 'Fecha', 'Revisión', 'Remitente', 'Correo',
                           'Destinatario', 'solicitud_dsc', 'Asunto', 'Acciones'];
  correosDataSource = new MatTableDataSource<correoSolicitud>;
  remitentesDataSource = new MatTableDataSource<remitentes>;
  destinatarioDataSource = new MatTableDataSource<destinatario>;
  asuntoDataSource = new MatTableDataSource<asunto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmCorreos = new FormGroup({
    folio: new FormControl(''),
    fecha_correo: new FormControl('', Validators.required),
    remitente_id: new FormControl('', Validators.required),
    asunto: new FormControl('', Validators.required),
    tipo_correo: new FormControl('', Validators.required),
    destinatario_id: new FormControl('', Validators.required),
    seguimiento_id: new FormControl('', Validators.required),
    horaCorreo: new FormControl('', Validators.required),
    minutoCorreo: new FormControl('', Validators.required),
    solDuplicado: new FormControl(''),
    solComplemento: new FormControl(''),
    recursoRev: new FormControl(''),
    diasHabiles: new FormControl(''),
    solicitudTer: new FormControl(''),
    sol_Cancelada: new FormControl(''),
  });


  constructor(private formBuilder: FormBuilder,
    private DbDatosService: DbDatosService,
    private http: HttpClient,
    private dt: DatePipe) { }

  ngOnInit(): void {
    if(this.folPadre != '')
      this.frmCorreos.patchValue({
      folio: this.folPadre,
    })
    this.getCorreosSolicitudxFolio();
    this.getTipoCorreo();
    this.getAllRemitentes();
    this.getAllAsuntos();
    this.getAllDestinatario();
    this.getAllSeguimiento();
    this.getAllAreasTrans();
    this.testLoop();
  }

  insSolicitudCorreo() {
    console.log(this.frmCorreos.value);
    console.log(this.folioSolAct);
/*
    if (this.frmCorreos.value.folio === '') {
      this.frmCorreos.patchValue({
        folio: this.folioSolAct,
          });
    }
 */
    let dip = 0;
    let comp = 0
    let term = 0;
    let canc = 0;

    if(this.frmCorreos.value.solDuplicado) {
      dip = 1;
    }
    if (this.frmCorreos.value.solComplemento) {
      comp = 1;
    }
    if (this.frmCorreos.value.solicitudTer) {
      term = 1;
    }

    if (this.frmCorreos.value.sol_Cancelada) {
      canc = 1;
    }

    if (this.idCorreoSolicitud === 0 ) {
      const header = new HttpHeaders().set('Type-conten', 'aplication-json');
      this.http.post(`${this.url}/trans/putSolicitudCorreo`,{
        folio: this.frmCorreos.value.folio,
        fecha_correo: this.frmCorreos.value.fecha_correo + ' ' + this.frmCorreos.value.horaCorreo + ':' + this.frmCorreos.value.minutoCorreo + ':00',
        remitente_id: this.frmCorreos.value.remitente_id,
        asunto: this.frmCorreos.value.asunto,
        tipo_correo: this.frmCorreos.value.tipo_correo,
        destinatario_id: this.frmCorreos.value.destinatario_id,
        seguimiento_id: this.frmCorreos.value.seguimiento_id,
        recurso_revision: this.frmCorreos.value.recursoRev,
        sol_Duplicada: dip,
        sol_Complementaria: comp,
        solicitudTer: term,
        diasHabiles: this.frmCorreos.value.diasHabiles,
        sol_Cancelada: canc //this.frmCorreos.value.sol_Cancelada
      },
      {headers: header}).subscribe((datosCorreo: any) => {
        this.getCorreosSolicitudxFolio();
        this.getLimpiaFrmCorreo();
        Swal.fire('Se guardo el registro de correo satisfactoriamente.', 'Presiona el botón para continuar!','success');
        });
      this.editando = false;
      //console.log(this.editando);
    } else {
      const header = new HttpHeaders().set('Type-conten', 'aplication-json');
      this.http.post(`${this.url}/trans/upSolicitudCorreo`,{
        id: this.idCorreoSolicitud,
        folio: this.frmCorreos.value.folio,
        fecha_correo: this.frmCorreos.value.fecha_correo + ' ' + this.frmCorreos.value.horaCorreo + ':' + this.frmCorreos.value.minutoCorreo + ':00',
        remitente_id: this.frmCorreos.value.remitente_id,
        asunto: this.frmCorreos.value.asunto,
        tipo_correo: this.frmCorreos.value.tipo_correo,
        destinatario_id: this.frmCorreos.value.destinatario_id,
        seguimiento_id: this.frmCorreos.value.seguimiento_id,
        recurso_revision: this.frmCorreos.value.recursoRev,
        sol_Duplicada: dip,
        sol_Complementaria: comp,
        solicitudTer: term,
        diasHabiles: this.frmCorreos.value.diasHabiles,
        sol_Cancelada: canc //this.frmCorreos.value.sol_Cancelada
      },
      {headers: header}).subscribe((datosCorreo: any) => {
        this.getCorreosSolicitudxFolio();
        this.getLimpiaFrmCorreo();
        Swal.fire('Se actualizó el registro seleccionado satisfactoriamente.', 'Presiona el botón para continuar!','success');
      });
      this.editando = false;
      //console.log(this.editando);
    }
  }

  getLimpiaFrmCorreo() {
    this.frmCorreos.patchValue({
      //folio: '',
      fecha_correo: '',
      remitente_id: '',
      //asunto: '',
      tipo_correo: '',
      destinatario_id:'',
      seguimiento_id: '',
      horaCorreo: '',
      minutoCorreo: '',
      recursoRev: '',
      solDuplicado: '',
      solComplemento: '',
      solicitudTer: '',
      diasHabiles: '',
      sol_Cancelada: '',
    })
    this.idCorreoSolicitud = 0;
  }

  getCorreosSolicitudxFolio() {
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    this.http.post(`${this.url}/trans/getAllSolicitudCorreoXFolio`,{
      folio: this.frmCorreos.value.folio,
    },
    {headers: header}).subscribe((datosCorreo: any) => {
      this.correosDataSource = new MatTableDataSource(datosCorreo);
      this.correosDataSource.paginator = this.paginator;
      this.correosDataSource.sort = this.sort;

          //Swal.fire('Se guardo el registro de retrasos correctamente.', 'Presiona el botón para continuar!','success');
          //this.limpiaDatosformulario();
    });
  }

  getDatosTablaCorreos(regSelectCorreo: any) {
    console.log(regSelectCorreo);
    //const resultado = this.diasHabiles.find(element => element.indexOf === regSelectCorreo.diasHabiles);
    let lbDias = ''
    if (regSelectCorreo.dias_habiles < 10) {
      lbDias = '0' + regSelectCorreo.dias_habiles;
    } else {
      lbDias = regSelectCorreo.dias_habiles;
    }

    this.frmCorreos.patchValue({
      //folio: regSelectCorreo.folio,
      fecha_correo: regSelectCorreo.Fecha.substring(6,10) + '-' + regSelectCorreo.Fecha.substring(3,5) + '-' + regSelectCorreo.Fecha.substring(0,2),
      horaCorreo: regSelectCorreo.Fecha.substring(11, 13),
      minutoCorreo: regSelectCorreo.Fecha.substring(14, 17),
      remitente_id: regSelectCorreo.remitente_id,
      asunto: regSelectCorreo.asunto_id,
      tipo_correo: regSelectCorreo.tipo_correo_id,
      destinatario_id: regSelectCorreo.destinatario_id,
      seguimiento_id: regSelectCorreo.seguimiento_id,
      recursoRev: regSelectCorreo.Revisión,
      solDuplicado: regSelectCorreo.sol_Duplicada,
      solComplemento:regSelectCorreo.sol_Complementaria,
      solicitudTer: regSelectCorreo.solicitudTer,
      diasHabiles: lbDias,
      sol_Cancelada: regSelectCorreo.sol_Cancelada
    })
    this.idCorreoSolicitud = regSelectCorreo.id;
/*
      fechaEnvUTAG: regSeleccionado.UTAG.substring(6,10) + '-' + regSeleccionado.UTAG.substring(3,5) + '-' + regSeleccionado.UTAG.substring(0,2),
      horaEnvUTAG: regSeleccionado.UTAG.substring(11,13),
      minutosEnvUTAG: regSeleccionado.UTAG.substring(14,17),
       */
  }

  getTipoCorreo() {
    this.DbDatosService.getTipoCorreo().subscribe(resultado => {
      console.log(resultado);
      this.ItipoCorreo = resultado;
    })
  }

  getAllRemitentes() {
    this.DbDatosService.getAllRemitentes().subscribe(resultado => {
      this.Iremitentes = resultado;
      this.remitentesDataSource = new MatTableDataSource(resultado);
//      this.remitentesDataSource.paginator = this.paginator
//      this.remitentesDataSource.sort = this.sort;

    })
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

  getAllAsuntos() {
    this.DbDatosService.getAllAsuntos().subscribe(resultado => {
      this.Iasunto = resultado;
      this.asuntoDataSource = new MatTableDataSource(resultado);
//      this.asuntoDataSource.paginator = this.paginator;
//      this.asuntoDataSource.sort = this.sort;

    })
  }


  getAllDestinatario() {
    this.DbDatosService.getAllDestinatario().subscribe(resultado => {
      this.Idestinatario = resultado;
      this.destinatarioDataSource = new MatTableDataSource(resultado);
//      this.destinatarioDataSource.paginator = this.paginator;
//      this.destinatarioDataSource.sort = this.sort;
    })
  }

  getAllSeguimiento() {
    this.DbDatosService.getAllSeguimiento().subscribe(resultado  => {
      this.Iseguimiento = resultado;
    })
  }


  getAllAreasTrans() {
    this.DbDatosService.getAllAreasTransparencia().subscribe(resultado => {
      this.IareasTransparencia = resultado;
    })
  }

  applyFilter(event: Event, tabla: number) {
    const filterValue = (event.target as HTMLInputElement).value;
    //console.log(filterValue);
    //console.log(this.solTransDataSource);
        switch (tabla) {
           case 2: {
            this.correosDataSource.filter = filterValue.trim().toLowerCase();
            if (this.correosDataSource.paginator) {
              this.correosDataSource.paginator.firstPage();
            }
                break;
          }
}
    }

    navegacionFormulario (modulo: number): void  {
      //console.log('navegación formulario');
      //console.log(modulo);
      this.regresoPrincipal.emit(modulo);
    }

    navegacionInterna (modulo: number): void  {
      //console.log('navegacion interna');
      //console.log(modulo);
      let moduloAnt = 0;
       moduloAnt = this.moduloSeleccionado;
      // console.log(moduloAnt);
      this.moduloSeleccionado = modulo;
      this.actualizaCatalogos(moduloAnt);
    }

    actualizaCatalogos (actCatalogo: number) {
      //console.log('actyalización de catalogos');
      //console.log(actCatalogo);
      switch (actCatalogo) {
        case 3: {
          this.getAllRemitentes();
          break;
        }
        case 4: {
          this.getAllDestinatario();
          break;
        }
        case 5: {
          this.getAllAsuntos();
          break;
        }
        case 6: {
          this.getAllSeguimiento();
          break;
        }
  }
    }

}
