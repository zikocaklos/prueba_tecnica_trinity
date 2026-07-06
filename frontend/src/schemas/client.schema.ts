import { z } from 'zod'

const normalizedText = (value: string) => value.trim().replace(/\s+/g, ' ')

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
  identificationNumber: z
    .string()
    .trim()
    .min(1, 'Número de identificación es requerido')
    .refine((value) => /^\d+$/.test(value), {
      message: 'El número de identificación solo debe contener números',
    })
    .refine((value) => value.length >= 5 && value.length <= 20, {
      message: 'El número de identificación debe tener entre 5 y 20 dígitos',
    }),
  firstName: z.string().transform(normalizedText).refine((value) => value.length >= 2, {
    message: 'El nombre debe tener mínimo 2 caracteres',
  }),
  lastName: z.string().transform(normalizedText).refine((value) => value.length >= 2, {
    message: 'El apellido debe tener mínimo 2 caracteres',
  }),
  email: z.string().trim().email('Correo electrónico inválido'),
  birthDate: birthDateSchema,
})

export type ClientFormValues = z.infer<typeof clientSchema>
