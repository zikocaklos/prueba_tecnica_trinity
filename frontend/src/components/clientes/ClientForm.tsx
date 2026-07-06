"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClientFormValues, clientSchema } from '../../schemas/client.schema'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

type Props = {
  defaultValues?: Partial<ClientFormValues>
  mode: 'create' | 'edit'
  onSubmit: (data: ClientFormValues) => Promise<void>
}

const identificationTypes = ['CC', 'CE', 'PASSPORT', 'NIT']

export function ClientForm({ defaultValues, mode, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        {mode === 'create'
          ? 'Complete los datos del cliente para registrarlo en el sistema bancario.'
          : 'Solo podrá modificar los datos personales del cliente; su documento no se puede cambiar.'}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Select label="Tipo de identificación" disabled={mode === 'edit'} {...register('identificationType')}>
            <option value="">Selecciona una opción</option>
            {identificationTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          {errors.identificationType && <p className="mt-1 text-sm text-red-600">{errors.identificationType.message}</p>}
        </div>
        <div>
          <Input
            id="identificationNumber"
            label="Número de identificación"
            readOnly={mode === 'edit'}
            {...register('identificationNumber')}
            aria-invalid={errors.identificationNumber ? 'true' : 'false'}
          />
          {errors.identificationNumber && <p className="mt-1 text-sm text-red-600">{errors.identificationNumber.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input
            id="firstName"
            label="Nombres"
            {...register('firstName')}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>
        <div>
          <Input
            id="lastName"
            label="Apellidos"
            {...register('lastName')}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <Input
          id="email"
          type="email"
          label="Correo electrónico"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <Input
          id="birthDate"
          type="date"
          label="Fecha de nacimiento"
          {...register('birthDate')}
          aria-invalid={errors.birthDate ? 'true' : 'false'}
        />
        {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {mode === 'create' ? 'Crear cliente' : 'Actualizar cliente'}
        </Button>
      </div>
    </form>
  )
}
