const { validator, cpf } = require('cpf-cnpj-validator');
const Joi = require('joi').extend(validator);
const { password, objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    /*
    Identificacao do titular
    */
    nomeTitular: Joi.string().required(),
    cpfTitular: Joi.document().cpf().required(), 
    dataNascimentoTitular: Joi.date().required(),
    profissaoTitular: Joi.string().optional(),
    tituloEleitoralTitular: Joi.string().pattern(/^\d+$/).optional(),
    rgTitular: Joi.string().pattern(/^\d+$/).required(),
    contatoTitular: Joi.string().optional(),
    escolaridadeTitular: Joi.string().optional(),
    cadUnicoTitular: Joi.string().optional(),
    estadoCivilTitular: Joi.string().required(), //'SOLTEIRO','SOLTEIRA','UNIÃO ESTÁVEL','CASADO','CASADA','DIVORCIADO','DIVORCIADA' //duvida se deixo ou nao isso

    
    /*
    identificacao Conjugue
    */
    nomeConjugue:Joi.string().optional(),
    dataNascimentoConjugue:Joi.date().optional(),
    cpfConjugue:Joi.string().length(11).optional(),
    profissaoConjugue:Joi.string().optional(),
    rgConjugue:Joi.string().optional(),
    contatoConjugue:Joi.string().optional(),
    escolaridadeConjugue:Joi.string().optional(),
    /*
    Renda Familiar
    */
    rendaFamiliar:Joi.string(),

    acessoABeneficiosSociais:Joi.object({
      possuiBeneficiosSociais: Joi.boolean().required(),
      quaisBeneficiosSociais:Joi.when('possuiBeneficiosSociais',{
        is: true,
        then:Joi.string().required(),
        otherwise:Joi.string().optional(),
      })
    }).required(),
    /*
    Composicao Familiar
    */
    composicaoFamiliar: Joi.array().items(
      Joi.object({
        nomeFamiliar : Joi.string().required(),
        parentescoFamiliar : Joi.string().required(),
        dataNascimentoFamiliar : Joi.date().required(),
      })
    ).optional(),
    familiarComDeficiencia: Joi.object({
      possuiFamiliarComDeficiencia:Joi.boolean().required(),
      quemPossuiDeficiencia:Joi.when('possuiFamiliarComDeficiencia',{
        is:true,
        then:Joi.string().required(),
        otherwise:Joi.string().optional(),
      })
    }).required(),

    /*
     IDENTIFICAÇÃO DO IMÓVEL HABILITADO
    */
    loteamentoImovel:Joi.string().required(),
    loteImovel:Joi.string(),
    quadraImovel:Joi.string(),

    viaImovel:Joi.object({
      tipoViaImovel:Joi.string().valid('Av.', 'Rua').required(),
      nomeViaImovel:Joi.string().required(),
    }).required(),

    caracteristicasConstrucao:Joi.string().required(),

    tempoDeResidencia:Joi.object({
      possuiOutroImovel:Joi.boolean().required(),
      qualOutroImovel:Joi.when('possuiOutroImovel',{
        is:true,
        then:Joi.string().required(),
        otherwise:Joi.string().optional(),
      })
    }),

    tipoDeImovel:Joi.string(),

    /*
    CARACTERÍSTICAS/ DOCUMENTOS REFERENTE A OCUPAÇÃO/ DATA DO DOCUMENTO
    */
    caracteristicaReferenteAOcupacao:Joi.object({
      tipoDeCaracteristicaReferenteAOcupacao:Joi.string(),//Termo de ocupacao,recibo,cessao de direto,invasao ou outro
    }).required(),

    Observacao:Joi.string().optional(),
    dataDocumento:Joi.date().required(),


  }),
};


module.exports = {
  create,
};
