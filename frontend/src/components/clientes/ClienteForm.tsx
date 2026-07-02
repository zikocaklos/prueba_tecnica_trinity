"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clienteSchema, ClienteForm as ClienteFormType } from '../../schemas/cliente.schema'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type Props = {
  defaultValues?: Partial<ClienteFormType>
  onSubmit: (data: ClienteFormType) => Promise<void> | void
}

export function ClienteForm({ defaultValues, onSubmit }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClienteFormType>({
    resolver: zodResolver(clienteSchema),
    defaultValues: defaultValues as any,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Tipo Identificación" {...register('tipoIdentificacion')} />
        <Input label="Número Identificación" {...register('numeroIdentificacion')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombres" {...register('nombres')} />
        <Input label="Apellidos" {...register('apellidos')} />
      </div>

      <Input label="Correo" type="email" {...register('correoElectronico')} />
      <Input label="Fecha Nacimiento" type="date" {...register('fechaNacimiento')} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  )
}
