import React from 'react'
import { useForm } from 'react-hook-form'
import { ClienteForm as ClienteFormType } from '../../schemas/cliente.schema'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

type Props = {
  defaultValues?: Partial<ClienteFormType>
  onSubmit: (data: ClienteFormType) => Promise<void> | void
}

export function ClienteForm({ defaultValues, onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<ClienteFormType>({
    defaultValues: defaultValues as any,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <Input label="Tipo Identificación" {...register('tipoIdentificacion', { required: true })} />
          <Input label="Número Identificación" {...register('numeroIdentificacion', { required: true, minLength: 3 })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nombres" {...register('nombres', { required: true, minLength: 2 })} />
        <Input label="Apellidos" {...register('apellidos', { required: true, minLength: 2 })} />
      </div>
      <Input label="Correo" type="email" {...register('correoElectronico', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i })} />
      <Input
        label="Fecha Nacimiento"
        type="date"
        {...register('fechaNacimiento', {
          required: true,
          validate: (val) => {
            const d = new Date(val)
            if (Number.isNaN(d.getTime())) return 'Fecha inválida'
            const age = new Date().getFullYear() - d.getFullYear()
            return age >= 18 || 'Debe ser mayor de edad'
          },
        })}
      />

      <div className="flex justify-end">
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
