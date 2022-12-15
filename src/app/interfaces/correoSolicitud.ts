export interface correoSolicitud {
  id: number;
  Folio: string;
  Fecha: Date;
  remitente_id: number;
  asunto_id: number;
  tipo_correo_id: number;
  destinatario_id: number;
  seguimiento_id: number;
  Asunto: string;
  Remitente: string;
  Correo: string;
  Destinatario: string;
  //solicitud_dsc: string;
  Revision: string;
  diasHabiles: number;
  sol_Duplicada: number;
  sol_Complementaria: number;
  solicitudTer: number;
  sol_Cancelada: number;
}
