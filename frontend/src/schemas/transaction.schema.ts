import { z } from 'zod'

export const transactionTypeSchema = z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'])

export const transactionSchema = z.object({
  type: transactionTypeSchema,
  amount: z
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: 'Monto debe ser numérico',
    })
    .positive('Monto debe ser mayor que cero'),
  sourceAccountId: z
    .string()
    .optional()
    .refine((value) => value === undefined || value.length > 0, {
      message: 'Cuenta origen es requerida',
    }),
  destinationAccountId: z
    .string()
    .optional()
    .refine((value) => value === undefined || value.length > 0, {
      message: 'Cuenta destino es requerida',
    }),
})
.superRefine((data, ctx) => {
  if (data.type === 'DEPOSIT') {
    if (!data.destinationAccountId) {
      ctx.addIssue({ path: ['destinationAccountId'], code: z.ZodIssueCode.custom, message: 'Cuenta destino es requerida para consignación' })
    }
  }

  if (data.type === 'WITHDRAWAL') {
    if (!data.sourceAccountId) {
      ctx.addIssue({ path: ['sourceAccountId'], code: z.ZodIssueCode.custom, message: 'Cuenta origen es requerida para retiro' })
    }
  }

  if (data.type === 'TRANSFER') {
    if (!data.sourceAccountId) {
      ctx.addIssue({ path: ['sourceAccountId'], code: z.ZodIssueCode.custom, message: 'Cuenta origen es requerida para transferencia' })
    }
    if (!data.destinationAccountId) {
      ctx.addIssue({ path: ['destinationAccountId'], code: z.ZodIssueCode.custom, message: 'Cuenta destino es requerida para transferencia' })
    }
    if (data.sourceAccountId && data.destinationAccountId && data.sourceAccountId === data.destinationAccountId) {
      ctx.addIssue({ path: ['destinationAccountId'], code: z.ZodIssueCode.custom, message: 'Cuenta destino debe ser diferente a la cuenta origen' })
    }
  }
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
