import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbDatosService } from '../../services/db-datos.service'
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { asunto } from '../../interfaces/asunto';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-asunto',
  templateUrl: './asunto.component.html',
  styleUrls: ['./asunto.component.scss']
})
export class AsuntoComponent implements OnInit {

  @Output() accionRegreso = new EventEmitter<number>();

  cont = 0;
  url = 'https://localhost:3000/admin';

  Iasunto: asunto[] = [];
  idAsuntoSeleccionado = 0;
  IasuntoSolicitud: asunto[] = [];
  accionesPermitidas = 5;

  asuntoDataSource = new MatTableDataSource<asunto>;
  asuntoTitulos: string[] = ['Asunto', 'Acciones'];

  frmAsunto = new FormGroup({
    //id: new FormControl(''),
    asunto: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    })

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private formBuilder: FormBuilder,
    private DbDatosService: DbDatosService,
    private http: HttpClient,
    private dt: DatePipe) { }

  ngOnInit(): void {
    this.getAllAsuntos();
  }

  putAsunto() {
    console.log(this.frmAsunto.value);
    const header = new HttpHeaders().set('Type-content', 'application-json');
    if(this.idAsuntoSeleccionado == 0 ) {
        this.http.post(`${this.url}/trans/putAsunto`,{
                  asunto: this.frmAsunto.value.asunto
        },
        {headers: header}).subscribe((datosAsunto: any) => {
          this.setLimpiaAsunto();
          this.getAllAsuntos();
          Swal.fire('Se guardo el asunto correctamente.', 'Presiona el botón para continuar!','success');
        })
    } else {
      this.http.post(`${this.url}/trans/updAsunto`,{
        id: this.idAsuntoSeleccionado,
        asunto: this.frmAsunto.value.asunto},
      {headers: header}).subscribe((datosAsunto: any) => {
      this.setLimpiaAsunto();
      this.getAllAsuntos();
      Swal.fire('Se actualizó el asunto seleccionado correctamente.', 'Presiona el botón para continuar!','success');
    })
    }
  }

  setLimpiaAsunto() {
    this.frmAsunto.patchValue({
      //id: new FormControl(''),
      asunto: '',
      });
      this.idAsuntoSeleccionado = 0;
  }

  obtieneAsuntoSeleccionado(datosAsuntos: any) {
    console.log(datosAsuntos);
    this.idAsuntoSeleccionado = datosAsuntos.id;
    this.frmAsunto.patchValue({
      asunto: datosAsuntos.Asunto,
      })
  }

  getAllAsuntos() {
    this.DbDatosService.getAllAsuntos().subscribe(resultado => {
      this.Iasunto = resultado;
      this.asuntoDataSource = new MatTableDataSource(resultado);
      this.asuntoDataSource.paginator = this.paginator;
      this.asuntoDataSource.sort = this.sort;
    })
  }


  applyFilter(event: Event, tabla: number) {
    const filterValue = (event.target as HTMLInputElement).value;
    //console.log(filterValue);
    //console.log(this.solTransDataSource);
        switch (tabla) {
           case 5: {
            console.log(' entro en el 2')
            this.asuntoDataSource.filter = filterValue.trim().toLowerCase();
            if (this.asuntoDataSource.paginator) {
              this.asuntoDataSource.paginator.firstPage();
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
