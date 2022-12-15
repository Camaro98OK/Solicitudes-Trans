import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbDatosService } from '../../services/db-datos.service'
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { areasTrasparencia } from '../../interfaces/areas';
import { destinatario } from '../../interfaces/destinatario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-destinatario',
  templateUrl: './destinatario.component.html',
  styleUrls: ['./destinatario.component.scss']
})
export class DestinatarioComponent implements OnInit {

  @Output() accionRegreso = new EventEmitter<number>();

  accionesPermitidas = 4;
  horasDia:  string[] = [];
  minutosHora:  string[] = [];
  diasHabiles: string[] = [];


  cont = 0;
  url = 'https://localhost:3000/admin';
  idDestinatarioSeleccionado = 0;
  destinatarioTitulos: string[] = ['Nombre', 'Estatus', 'Area', 'Acciones'];
  Idestinatario: destinatario[] = [];

  IareasTransparencia: areasTrasparencia[] = [];
  destinatarioDataSource = new MatTableDataSource<destinatario>;

  frmDestinatario = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    area_id: new FormControl('', Validators.required),
    estatus_id: new FormControl('', Validators.required),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private formBuilder: FormBuilder,
    private DbDatosService: DbDatosService,
    private http: HttpClient,
    private dt: DatePipe) { }

  ngOnInit(): void {
    this.getAllDestinatario();
    this.testLoop();
    this.getAllAreasTrans()
  }

  putDestinatario() {
    //console.log(this.frmDestinatario.value);
    const header = new HttpHeaders().set('Type-conten', 'aplication-json');
    if(this.idDestinatarioSeleccionado === 0 ) {
        this.http.post(`${this.url}/trans/putDestinatario`,{
          nombre: this.frmDestinatario.value.nombre,
          area_id: this.frmDestinatario.value.area_id,
          estatus_id: this.frmDestinatario.value.estatus_id,
        },
        {headers: header}).subscribe((datosDestinatario: any) => {
          this.setLimpiaDestinatario();
          this.getAllDestinatario();
          Swal.fire('Se guardo el destinatario satisfactoriamente.', 'Presiona el botón para continuar!','success');
        });
    } else {
      this.http.post(`${this.url}/trans/updDestinatario`,{
        id: this.idDestinatarioSeleccionado,
        nombre: this.frmDestinatario.value.nombre,
        area_id: this.frmDestinatario.value.area_id,
        estatus_id: this.frmDestinatario.value.estatus_id,
      },
      {headers: header}).subscribe((datosDestinatario: any) => {
        this.setLimpiaDestinatario();
        this.getAllDestinatario();
        Swal.fire('Se actualizó el destinatario satisfactoriamente.', 'Presiona el botón para continuar!','success');
      });
    };
  }

  setLimpiaDestinatario() {
    this.frmDestinatario.patchValue ({
      nombre: '',
      area_id: '',
      estatus_id: '',
    });
    this.idDestinatarioSeleccionado = 0;
  }

  obtieneDestinatarioSeleccionado(datosDestinatario: any) {
    console.log(datosDestinatario);
    this.idDestinatarioSeleccionado = datosDestinatario.id;
    console.log(this.idDestinatarioSeleccionado);
    this.frmDestinatario.patchValue ({
      nombre: datosDestinatario.Nombre,
      area_id: datosDestinatario.area_id,
      estatus_id: datosDestinatario.estatus_id,
    });
  }

  getAllDestinatario() {
    this.DbDatosService.getAllDestinatario().subscribe(resultado => {
      this.Idestinatario = resultado;
      this.destinatarioDataSource = new MatTableDataSource(resultado);
      this.destinatarioDataSource.paginator = this.paginator;
      this.destinatarioDataSource.sort = this.sort;
    })
  }

  getAllAreasTrans() {
    this.DbDatosService.getAllAreasTransparencia().subscribe(resultado => {
      this.IareasTransparencia = resultado;
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

  applyFilter(event: Event, tabla: number) {
    const filterValue = (event.target as HTMLInputElement).value;
    //console.log(filterValue);
    //console.log(this.solTransDataSource);
    switch (tabla) {
          case 4: {
            console.log(' entro en el 4')
            this.destinatarioDataSource.filter = filterValue.trim().toLowerCase();
            if (this.destinatarioDataSource.paginator) {
              this.destinatarioDataSource.paginator.firstPage();
            }
              break;
          }
    }
  }

  navegacionFormulario (modulo: number): void  {
    this.accionRegreso.emit(modulo);
    //this.accionesPermitidas = modulo;
}

}
