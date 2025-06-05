const { cpf } = require('cpf-cnpj-validator');
const { z } = require('zod');

const createSchema = z.object({
  // Identificação do titular
  nomeTitular: z.string(),
  cpfTitular: z.string().refine((val) => cpf.isValid(val), {
    message: "CPF inválido",
  }),
  dataNascimentoTitular: z.coerce.date(),
  profissaoTitular: z.string().optional(),
  tituloEleitoralTitular: z.string().regex(/^\d+$/).optional(),
  rgTitular: z.string().regex(/^\d+$/),
  contatoTitular: z.string().optional(),
  escolaridadeTitular: z.string().optional(),
  cadUnicoTitular: z.string().optional(),
  estadoCivilTitular: z.string(),

  // Identificação do cônjuge
  nomeConjugue: z.string().optional(),
  dataNascimentoConjugue: z.coerce.date().optional(),
  cpfConjugue: z.string().length(11).optional(),
  profissaoConjugue: z.string().optional(),
  rgConjugue: z.string().optional(),
  contatoConjugue: z.string().optional(),
  escolaridadeConjugue: z.string().optional(),

  // Renda familiar
  rendaFamiliar: z.string(),

  acessoABeneficiosSociais: z.object({
    possuiBeneficiosSociais: z.boolean(),
    quaisBeneficiosSociais: z.string().optional(),
  }).superRefine((obj, ctx) => {
    if (obj.possuiBeneficiosSociais && !obj.quaisBeneficiosSociais) {
      ctx.addIssue({
        path: ['quaisBeneficiosSociais'],
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório quando há benefício social',
      });
    }
  }),

  // Composição familiar
  composicaoFamiliar: z.array(z.object({
    nomeFamiliar: z.string(),
    parentescoFamiliar: z.string(),
    dataNascimentoFamiliar: z.coerce.date(),
  })).optional(),

  familiarComDeficiencia: z.object({
    possuiFamiliarComDeficiencia: z.boolean(),
    quemPossuiDeficiencia: z.string().optional(),
  }).superRefine((obj, ctx) => {
    if (obj.possuiFamiliarComDeficiencia && !obj.quemPossuiDeficiencia) {
      ctx.addIssue({
        path: ['quemPossuiDeficiencia'],
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório quando há familiar com deficiência',
      });
    }
  }),

  // Identificação do imóvel
  loteamentoImovel: z.string(),
  loteImovel: z.string().optional(),
  quadraImovel: z.string().optional(),

  viaImovel: z.object({
    tipoViaImovel: z.enum(['Av.', 'Rua']),
    nomeViaImovel: z.string(),
  }),

  caracteristicasConstrucao: z.string(),

  tempoDeResidencia: z.object({
    possuiOutroImovel: z.boolean(),
    qualOutroImovel: z.string().optional(),
  }).superRefine((obj, ctx) => {
    if (obj.possuiOutroImovel && !obj.qualOutroImovel) {
      ctx.addIssue({
        path: ['qualOutroImovel'],
        code: z.ZodIssueCode.custom,
        message: 'Campo obrigatório quando possui outro imóvel',
      });
    }
  }),

  tipoDeImovel: z.string().optional(),

  caracteristicaReferenteAOcupacao: z.object({
    tipoDeCaracteristicaReferenteAOcupacao: z.string().optional(),
  }),

  Observacao: z.string().optional(),
  dataDocumento: z.coerce.date(),
});

module.exports = {
  createSchema,
};
