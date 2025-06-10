import { cpf } from 'cpf-cnpj-validator';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const createFormSchema = z.object({
  // --- Dados do Titular ---
  nomeTitular: z.string().min(1, 'O nome do titular é obrigatório'),
  cpfTitular: z.string().refine((val) => val && cpf.isValid(val), {
    message: "CPF inválido",
  }),
  rgTitular: z.string().min(1, 'O RG é obrigatório'),
  dataNascTitular: z.coerce.date({ required_error: "A data de nascimento é obrigatória." }).nullable(),  contatoTitular: z.string().optional(),
  profissaoTitular: z.string().optional(),
  escolaridadeTitular: z.string().optional(),
  tituloEleitoralTitular: z.string().optional(),
  cadUnicoTitular: z.string().optional(),
  estadoCivilTitular: z.string().min(1, "O estado civil é obrigatório"),

  // --- Dados do Cônjuge ---
  nomeConjuge: z.string().optional(),
  cpfConjuge: z.string().optional(),
  rgConjuge: z.string().optional(),
  dataNascConjuge: z.coerce.date().nullable().optional(),
  contatoConjuge: z.string().optional(),
  profissaoConjuge: z.string().optional(),
  escolaridadeConjuge: z.string().optional(),

  // --- Situação Socioeconômica e Familiar ---
  rendaFamiliar: z.string().optional(),
  acessoBeneficiosSociais: z.string().optional(),
  qualBeneficioSocial: z.string().optional(),

  composicaoFamiliar: z.array(
    z.object({
        nome: z.string().min(1, 'obrigatório.'),
        parentesco: z.string().min(1, 'obrigatório.'),
        dataNasc: z.coerce.date({
            invalid_type_error: 'Data de nascimento inválida.',
        }).nullable(),
    })
  ),
  pessoaComDeficienciaFamilia: z.string().optional(),
  quemPessoaComDeficiencia: z.string().optional(),

  // --- Informações do Imóvel ---
  loteamento: z.string().min(1, 'O loteamento é obrigatório'),
  loteImovel: z.string().optional(),
  quadraImovel: z.string().optional(),
  tempoResidencia: z.string().optional(),
  tipoLogradouro: z.string().optional(),
  nomeLogradouro: z.string().min(1, 'O nome do logradouro é obrigatório'),
  caracteristicasConstrucao: z.string().optional(),
  outrasCaracteristicasConstrucao: z.string().optional(),
  possuiOutroImovel: z.string().optional(),
  qualOutroImovel: z.string().optional(),

  // --- Documentação de Posse/Ocupação ---
  tipoImovel: z.string().optional(),
  tipoDocumentoOcupacao: z.string().optional(),
  outroTipoDocumentoOcupacao: z.string().optional(),
  observacaoDocumentoOcupacao: z.string().optional(),
  dataDocumentoOcupacao: z.coerce.date().nullable().optional(),
  anexosDocumentos: z.array(z.instanceof(File)).optional(),
  
})
.superRefine((data, ctx) => {
    // Validação para dados do Cônjuge
    if ((data.estadoCivilTitular === 'Casado(a)' || data.estadoCivilTitular === 'União Estável')) {
        if (!data.nomeConjuge) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nomeConjuge'], message: 'O nome do cônjuge é obrigatório.' });
        }
        if (!data.cpfConjuge) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cpfConjuge'], message: 'O CPF do cônjuge é obrigatório.' });
        } else if (!cpf.isValid(data.cpfConjuge)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cpfConjuge'], message: 'CPF do cônjuge inválido.' });
        }
    }

    // Validações para campos condicionais
    if (data.acessoBeneficiosSociais === 'Sim' && !data.qualBeneficioSocial) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['qualBeneficioSocial'], message: 'Informe qual o benefício social.' });
    }
    
    if (data.pessoaComDeficienciaFamilia === 'Sim' && !data.quemPessoaComDeficiencia) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['quemPessoaComDeficiencia'], message: 'Informe quem é a pessoa com deficiência.' });
    }
    
    if (data.caracteristicasConstrucao === 'Outro' && !data.outrasCaracteristicasConstrucao) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['outrasCaracteristicasConstrucao'], message: 'Descreva as outras características.' });
    }

    if (data.possuiOutroImovel === 'Sim' && !data.qualOutroImovel) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['qualOutroImovel'], message: 'Informe onde se localiza o outro imóvel.' });
    }

    if (data.tipoDocumentoOcupacao === 'Outro' && !data.outroTipoDocumentoOcupacao) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['outroTipoDocumentoOcupacao'], message: 'Anexe outro tipo de documento.' });
    }
    
});