export interface Client {
  id: number;
  identificationType: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface ClientRequest {
  identificationType: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
}
