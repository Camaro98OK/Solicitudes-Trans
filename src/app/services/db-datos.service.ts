import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlxs';


@Injectable({
  providedIn: 'root'
})

export class DbDatosService {
  url = 'https://localhost:3000/admin';

  constructor(private http: HttpClient) {
    console.log('Esta funcionanado el servicio');
  }

  getTransTipoSolicitud(){
    let header = new HttpHeaders().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/tipoSolicitudes`, {headers: header});
  }

  getTransEstatusSolicitud() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/estatusSolicitud`, {headers: header});
    }

  getTransAsuntoSolicitud() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/asuntoSolicitud`, {Headers: header});
  }

  getTransAllSolicitudes() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/allSolicitudTrans`, {Headers: header});
  }

  getTransNumReg(){
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/totalRegistros`, {Headers: header});
  }

  getTotalesPorSolicitud() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/totalSolicitudes`, {Headers: header});
  }

  getTipoCorreo() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/tipoDeCorreo`,{Headers: header});
  }

  getAllRemitentes() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/allRemitentes`, {Headers: header});
  }

  getAllAsuntos() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/allAsuntos`, {Headers: header});
  }

  getAllDestinatario() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/allDestinatarios`, {Headers: header});
  }

  getAllSeguimiento() {
    let header = new Headers().set('Type-content', 'application-jason');
    return this.http.post<any>(`${this.url}/trans/seguimientoAreas`, {Headers: header});
  }
/*
  getAllSolicitudCorreoXFolio() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/getAllSolicitudCorreoXFolio`, {Headers: header});
  }
*/
  getAllAreasTransparencia() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/areasTransparencia`, {Headers: header});
  }

  getAllTemas() {
    let header = new Headers().set('Type-content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/getAllTemas`, {Headers: header});
  }

  expAllSolicitudes() {
    let header = new Headers().set('Type-Content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/exportSolicitudes`, {Headers: header});
  }

  expAllSolicitudesDetalle() {
    let header = new Headers().set('Type-Content', 'application-json');
    return this.http.post<any>(`${this.url}/trans/exportSolicitudesdetalle`, {Headers: header});
  }

  exportarAExcel(json: any, json2: any, excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json2);

    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, worksheet,'solicitudes');
    XLSX.utils.book_append_sheet(workBook, worksheet1,'Detalle solicitud');
    XLSX.writeFile(workBook,excelFileName);
    /**
     * ES LA PRIMERA PRUEBA
     *

    const workbook: XLSX.WorkBook = {
      Sheets: {data: worksheet, data2: worksheet1},
      SheetNames: ['data', 'data2']
    };

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    this.saveAsExcel(excelBuffer, excelFileName);
    */
  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    //XLSX.writeFile(data, 'DatosSolicitudesTransparencia'+ EXCEL_EXT);
    FileSaver.saveAs(data, fileName + EXCEL_EXT);
    //this.File .saveAs(data, fileName + 'Datossolicitudes' +  EXCEL_EXT);
  }

}
