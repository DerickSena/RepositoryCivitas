import { api } from '../axios-config';

export type RegisterUserProps = {
  name: string;
  isForeign?: boolean;
  cpf?: string;
};

export async function registerUser(data: RegisterUserProps) {
  const response = await api.post(`/auth/register`, data);
  if (response.status !== 201) {
    throw new Error('Erro no registro');
  }
  return response.data;
}

export async function getUserByEmail(email: string) {
  const response = await api.get(`/users/email/${email}`);

  if (response.status !== 200) {
    throw new Error('Erro no registro');
  }
  return response.data;
}

export async function getUserMe() {
  const response = await api.get(`/users/me`);

  if (response.status !== 200) {
    throw new Error('Erro no registro');
  }
  return response.data;
}



export async function getAllUsers(data: any) {
  const response = await api.get(`/users`, data);
  if (response.status !== 200) {
    throw new Error('Erro no registro');
  }
  return response.data;
}
