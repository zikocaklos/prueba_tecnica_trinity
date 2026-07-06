import { Client } from '../types/client'

export function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function calculateAge(birthDate: string) {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }

  return age
}

export function getClientFullName(client: Partial<Client>) {
  return `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim()
}

export function formatDocumentType(type: string) {
  return type.toUpperCase()
}

export function getClientAgeLabel(client: Client) {
  const age = calculateAge(client.birthDate)
  return age === null ? 'Edad no disponible' : `${age} años`
}
