import { z } from 'zod'

const birthDateSchema = z
  .string()
  .min(1, 'Fecha de nacimiento es requerida')
  .refine((value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return false
    const today = new Date()
    const adult = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    return date <= adult
  }, {
    message: 'El cliente debe ser mayor de edad',
  })

export const clientSchema = z.object({
  identificationType: z.string().min(1, 'Tipo de identificación es requerido'),
  identificationNumber: z.string().min(1, 'Número de identificación es requerido'),
  firstName: z.string().min(2, 'Nombre debe tener mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener mínimo 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  birthDate: birthDateSchema,
})

export type ClientFormValues = z.infer<typeof clientSchema>
