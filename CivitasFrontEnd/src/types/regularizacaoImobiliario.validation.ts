import { cpf } from 'cpf-cnpj-validator';
import { z } from 'zod';

// Tamanho máximo de 5MB para o arquivo
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const createFormSchema = z.object({
  // --- Dados do Titular ---
  nomeTitular: z.string().min(1, 'O nome do titular é obrigatório'),
  cpfTitular: z.string().refine((val) => val && cpf.isValid(val), {
    message: "CPF inválido",
  }),
  rgTitular: z.string().min(1, 'O RG é obrigatório'),
  dataNascimentoTitular: z.coerce.date({ invalid_type_error: "A data de nascimento é inválida." })
    .refine(val => val !== null, { message: "A data de nascimento é obrigatória." })
    .nullable(),
  contatoTitular: z.string().min(1, "O contato é obrigatório"),
  profissaoTitular: z.string().min(1, "A profissão é obrigatória"),
  escolaridadeTitular: z.string().min(1, "A escolaridade é obrigatória"),
  tituloEleitoralTitular: z.string().min(1, "O título de eleitor é obrigatório"),
  cadUnicoTitular: z.string().min(1, "O CadÚnico é obrigatório"),
  estadoCivilTitular: z.string().min(1, "O estado civil é obrigatório"),

  // --- Dados do Cônjuge ---
  nomeConjugue: z.string().optional(),
  cpfConjugue: z.string().optional(),
  rgConjugue: z.string().optional(),
  dataNascimentoConjugue: z.coerce.date().optional().nullable(),
  contatoConjugue: z.string().optional(),
  profissaoConjugue: z.string().optional(),
  escolaridadeConjugue: z.string().optional(),

  // --- Situação Socioeconômica e Familiar ---
  rendaFamiliar: z.string().min(1, "A renda familiar é obrigatória"),
  acessoABeneficiosSociais: z.object({
    possuiBeneficiosSociais: z.enum(['Sim', 'Não']).refine(val => val !== null, { message: "Selecione uma opção." }).nullable(),
    quaisBeneficiosSociais: z.string().optional(),
  }),
  composicaoFamiliar: z.array(
    z.object({
        nomeFamiliar: z.string(),
        parentescoFamiliar: z.string(),
        dataNascimentoFamiliar: z.coerce.date({ invalid_type_error: 'Data de nascimento inválida.' }).nullable(),
    })
  ),
  familiarComDeficiencia: z.object({
      possuiFamiliarComDeficiencia: z.enum(['Sim', 'Não']).refine(val => val !== null, { message: "Selecione uma opção." }).nullable(),
      quemPossuiDeficiencia: z.string().optional(),
  }),

  // --- Informações do Imóvel ---
  loteamentoImovel: z.string().min(1, 'O loteamento é obrigatório'),
  loteImovel: z.string().min(1, 'O lote é obrigatório'),
  quadraImovel: z.string().min(1, 'A quadra é obrigatória'),
  tempoDeResidencia: z.string().min(1, 'O tempo de residência é obrigatório'),
  viaImovel: z.object({
    tipoViaImovel: z.string().min(1, 'O tipo de via é obrigatório'),
    nomeViaImovel: z.string().min(1, 'O nome da via é obrigatório'),
  }),
  caracteristicasConstrucao: z.string().min(1, 'A característica da construção é obrigatória'),
  tipoDeImovel: z.string().min(1, 'O tipo de imóvel é obrigatório'),
  OutroImovel: z.object({
    possuiOutroImovel: z.enum(['Sim', 'Não']).refine(val => val !== null, { message: "Selecione uma opção." }).nullable(),
    qualOutroImovel: z.string().optional(),
  }),
  
  // --- Documentação de Posse/Ocupação ---
  caracteristicaReferenteAOcupacao: z.object({
      tipoDeCaracteristicaReferenteAOcupacao: z.string().min(1, 'O tipo de característica do documento é obrigatório'),
      outroTipoDocumentoOcupacao: z.string().optional(),
  }),
  Observacao: z.string().optional(),
  dataDocumento: z.coerce.date({ invalid_type_error: "A data do documento é inválida." })
    .refine(val => val !== null, { message: "A data do documento é obrigatória." })
    .nullable(),
  anexosDocumentos: z.array(z.instanceof(File)).optional(),
})
.superRefine((data, ctx) => {
    // Validação para dados do Cônjuge
    if ((data.estadoCivilTitular === 'Casado(a)' || data.estadoCivilTitular === 'União Estável')) {
        if (!data.nomeConjugue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nomeConjugue'], message: 'O nome do cônjuge é obrigatório.' });
        }
        if (!data.cpfConjugue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cpfConjugue'], message: 'O CPF do cônjuge é obrigatório.' });
        } else if (!cpf.isValid(data.cpfConjugue)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cpfConjugue'], message: 'CPF do cônjuge inválido.' });
        }
    }

    if (data.acessoABeneficiosSociais.possuiBeneficiosSociais === 'Sim' && !data.acessoABeneficiosSociais.quaisBeneficiosSociais) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['acessoABeneficiosSociais.quaisBeneficiosSociais'], message: 'Informe qual o benefício social.' });
    }
    
    if (data.familiarComDeficiencia.possuiFamiliarComDeficiencia === 'Sim' && !data.familiarComDeficiencia.quemPossuiDeficiencia) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['familiarComDeficiencia.quemPossuiDeficiencia'], message: 'Informe quem é a pessoa com deficiência.' });
    }
    
    if (data.OutroImovel.possuiOutroImovel === 'Sim' && !data.OutroImovel.qualOutroImovel) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['OutroImovel.qualOutroImovel'], message: 'Informe onde se localiza o outro imóvel.' });
    }
    
    if (data.caracteristicaReferenteAOcupacao.tipoDeCaracteristicaReferenteAOcupacao === 'Outro' && !data.caracteristicaReferenteAOcupacao.outroTipoDocumentoOcupacao) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['caracteristicaReferenteAOcupacao.outroTipoDocumentoOcupacao'], message: 'Descreva o outro tipo de documento.' });
    }
});