import { z } from 'zod'

export const clienteSchema = z.object({
  tipoIdentificacion: z.string().min(1, { message: 'Tipo requerido' }),
  numeroIdentificacion: z.string().min(3, { message: 'Número inválido' }),
  nombres: z.string().min(2, { message: 'Mínimo 2 caracteres' }),
  apellidos: z.string().min(2, { message: 'Mínimo 2 caracteres' }),
  correoElectronico: z.string().email({ message: 'Correo inválido' }),
  fechaNacimiento: z
    .string()
    .refine((val) => {
      const d = new Date(val)
      if (Number.isNaN(d.getTime())) return false
      const today = new Date()
      const age = today.getFullYear() - d.getFullYear()
      return age >= 18
    }, { message: 'Debe ser mayor de edad' }),
})

export type ClienteForm = z.infer<typeof clienteSchema>
