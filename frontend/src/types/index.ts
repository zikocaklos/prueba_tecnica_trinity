export type ID = string

export type EstadoCuenta = 'ACTIVA' | 'INACTIVA' | 'CANCELADA'

export interface Cliente {
  id: ID
  tipoIdentificacion: string
  numeroIdentificacion: string
  nombres: string
  apellidos: string
  correoElectronico: string
  fechaNacimiento: string
  fechaCreacion?: string
  fechaModificacion?: string
}

export interface Cuenta {
  id: ID
  tipoCuenta: string
  numeroCuenta: string
  estado: EstadoCuenta
  saldo: number
  exentaGMF: boolean
  fechaCreacion?: string
  fechaModificacion?: string
  cliente?: Cliente
}

export type TipoTransaccion = 'CONSIGNACION' | 'RETIRO' | 'TRANSFERENCIA'

export interface Transaccion {
  id: ID
  tipo: TipoTransaccion
  cuentaOrigen?: Cuenta | null
  cuentaDestino?: Cuenta | null
  monto: number
  fecha: string
}
