import { Client } from '../../core/models/client.model';

export function calculateAge(birthDate: string): number | null {
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function getClientFullName(client: Partial<Client>): string {
  return `${client.firstName ?? ''} ${client.lastName ?? ''}`.trim();
}
