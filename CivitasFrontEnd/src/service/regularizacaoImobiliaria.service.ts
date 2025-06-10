import { api } from '../axios-config'; 
import { z } from 'zod';
import { createFormSchema } from '../types/regularizacaoImobiliario.validation';

export type RegularizacaoData = z.infer<typeof createFormSchema>;


export async function createRegularizacao(data: RegularizacaoData) {
  const response = await api.post(`/regularizacao-imobiliario`, data);

  if (response.status !== 201) {
    throw new Error('Erro no cadastro da regularização imobiliária');
  }

  return response.data;
}