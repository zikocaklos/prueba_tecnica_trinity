import { z } from 'zod'

export const accountTypeSchema = z.enum(['SAVINGS', 'CHECKING'])
export const accountStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'CANCELLED'])

export const accountSchema = z.object({
  accountNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^[0-9]{10}$/.test(value), {
      message: 'Número de cuenta debe tener 10 dígitos numéricos',
    }),
  clientId: z.string().min(1, 'Cliente es requerido'),
  accountType: accountTypeSchema,
  balance: z
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: 'Saldo debe ser numérico',
    })
    .min(0, 'Saldo no puede ser negativo'),
  exemptGmf: z.boolean(),
  status: accountStatusSchema.optional(),
})

export type AccountFormValues = z.infer<typeof accountSchema>
export type AccountType = z.infer<typeof accountTypeSchema>
export type AccountStatus = z.infer<typeof accountStatusSchema>
