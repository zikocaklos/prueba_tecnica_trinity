export type ID = string

export interface Cliente {
  id: ID
  tipoIdentificacion: string
  numeroIdentificacion: string
  nombres: string
  apellidos: string
  correoElectronico: string
  fechaNacimiento: string // ISO date
  fechaCreacion?: string
  fechaModificacion?: string
}
