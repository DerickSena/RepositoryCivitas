const { validator } = require('cpf-cnpj-validator');
const Joi = require('joi').extend(validator);

const create = {
  body: Joi.object()
    .keys({
      // --- Identificacao do titular ---
      nomeTitular: Joi.string().required(),
      cpfTitular: Joi.document().cpf().required(),
      dataNascimentoTitular: Joi.date().iso().required(),
      profissaoTitular: Joi.string().required(),
      tituloEleitoralTitular: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      rgTitular: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      contatoTitular: Joi.string().required(),
      escolaridadeTitular: Joi.string().required(),
      cadUnicoTitular: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      estadoCivilTitular: Joi.string().required(),

      // --- identificacao Conjugue (Opcional) ---
      nomeConjugue: Joi.string().allow('', null).optional(),
      dataNascimentoConjugue: Joi.date().iso().allow(null).optional(),
      cpfConjugue: Joi.string().allow('', null).optional(),
      profissaoConjugue: Joi.string().allow('', null).optional(),
      rgConjugue: Joi.string().allow('', null).optional(),
      contatoConjugue: Joi.string().allow('', null).optional(),
      escolaridadeConjugue: Joi.string().allow('', null).optional(),

      // --- Renda Familiar ---
      rendaFamiliar: Joi.string().required(),

      // --- Objetos (Serão parseados pelo middleware) ---
      acessoABeneficiosSociais: Joi.object({
        possuiBeneficiosSociais: Joi.string().valid('Sim', 'Não').required(),
        quaisBeneficiosSociais: Joi.when('possuiBeneficiosSociais', {
          is: 'Sim',
          then: Joi.string().required(),
          otherwise: Joi.string().allow('', null).optional(),
        }),
      }).required(),

      composicaoFamiliar: Joi.array()
        .items(
          Joi.object({
            nomeFamiliar: Joi.string().optional(),
            parentescoFamiliar: Joi.string().optional(),
            dataNascimentoFamiliar: Joi.date().iso().allow(null).optional(),
          })
        )
        .optional(),

      familiarComDeficiencia: Joi.object({
        possuiFamiliarComDeficiencia: Joi.string().valid('Sim', 'Não').required(),
        quemPossuiDeficiencia: Joi.when('possuiFamiliarComDeficiencia', {
          is: 'Sim',
          then: Joi.string().required(),
          otherwise: Joi.string().allow('', null).optional(),
        }),
      }).required(),

      // --- Imóvel ---
      loteamentoImovel: Joi.string().required(),
      loteImovel: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      quadraImovel: Joi.alternatives().try(Joi.string(), Joi.number()).required(),

      viaImovel: Joi.object({
        tipoViaImovel: Joi.string().required(),
        nomeViaImovel: Joi.string().required(),
      }).required(),

      caracteristicasConstrucao: Joi.string().required(),
      tempoDeResidencia: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      tipoDeImovel: Joi.string().required(),

      OutroImovel: Joi.object({
        possuiOutroImovel: Joi.string().valid('Sim', 'Não').required(),
        qualOutroImovel: Joi.when('possuiOutroImovel', {
          is: 'Sim',
          then: Joi.string().required(),
          otherwise: Joi.string().allow('', null).optional(),
        }),
      }).required(),

      // --- Documentação ---
      caracteristicaReferenteAOcupacao: Joi.object({
        tipoDeCaracteristicaReferenteAOcupacao: Joi.string().required(),
        outroTipoDocumentoOcupacao: Joi.when('tipoDeCaracteristicaReferenteAOcupacao', {
          is: 'Outro',
          then: Joi.string().required(),
          otherwise: Joi.string().allow('', null).optional(),
        }),
      }).required(),

      Observacao: Joi.string().allow('', null).optional(),
      dataDocumento: Joi.date().iso().required(),
    })
    .options({ allowUnknown: true }), // Permite outros campos (como os de arquivo)
};

module.exports = {
  create,
};