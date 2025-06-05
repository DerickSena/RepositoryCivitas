const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const regularizacaoImobiliariaSchema = mongoose.Schema(
  {
    /*
    trim: remove os espaços em branco no início e no final 
          de uma string automaticamente antes de salvar no banco.
    uppercase: valor de um campo String seja automaticamente convertido 
          para letras maiúsculas antes de ser salvo no banco de dados.
    */
    /*
    Identificacao do titular
    */
    nomeTitular: {
      type: String,
      required: true,
      trim: true,
      uppercase :true,
    },
    cpfTitular:{
      type:String,
      trim:true,
    },
    dataNascimentoTitular:{
      type: Date,
      required: true,
      trim: true,
    },
    profissaoTitular:{
      type: String,
      trim: true,
      uppercase :true,
    },
    tituloEleitoralTitular:{
      type: String,
      trim: true,
    },
    rgTitular:{
      type: String,
      required: true,
      trim: true,
    },
    contatoTitular:{
      type: String,
      trim: true,
    },
    escolaridadeTitular:{
      type: String,
      trim: true,
      uppercase: true,
    },
    cadUnicoTitular:{
      type: String,
      trim: true,
    },
    estadoCivilTitular:{
      type: String,
      required: true,
      //'SOLTEIRO','SOLTEIRA','UNIÃO ESTÁVEL','CASADO','CASADA','DIVORCIADO','DIVORCIADA'] //duvida se deixo ou nao isso
      
    },

    /*
    identificacao Conjugue
    */
    nomeConjugue:{
      type: String,
      trim: true,
      uppercase: true,
    },
    dataNascimentoConjugue:{
      type: Date,
      trim: true,
    },
    cpfConjugue:{
      type: String,
      trim: true,
    },
    profissaoConjugue:{
      type: String,
      trim: true,
      uppercase: true,
    },
    rgConjugue:{
      type: String,
      trim: true,
    },
    contatoConjugue:{
      type: String,
      trim: true,
    },
    escolaridadeConjugue:{
      type: String,
      trim: true,
      uppercase: true,
    },
    /*
    Renda Familiar
    */
    rendaFamiliar:{
      type: String,
      //'Menos de 1 Salário','De 1 a 3 Salários','De 3 a 5 Salários','Mais de 5 Salários'
    },


    acessoABeneficiosSociais:{
      possuiBeneficiosSociais: {
        type:Boolean,
      },
      quaisBeneficiosSociais:{
        type:String,
      },
    },
    

    /*
    Composicao Familiar
    */
    composicaoFamiliar:[
      {
        nomeFamiliar : {
          type : String,
          uppercase:true,
          trim:true,
        },
        parentescoFamiliar :{
          type : String,
          uppercase:true,
          trim:true,
        },
        dataNascimentoFamiliar:{
          type : Date,
          uppercase:true,
          trim:true,
        }
      },
    ],
    familiarComDeficiencia:{
      possuiFamiliarComDeficiencia:{
        type:Boolean,
        required:true,
      },
      quemPossuiDeficiencia:{
        type:String,
      },
    },
    /*
     IDENTIFICAÇÃO DO IMÓVEL HABILITADO
    */
    loteamentoImovel:{
      type: String,
      required:true,
    },
    loteImovel:{
      type: String,
    },
    quadraImovel:{
      type: String,
    },
    viaImovel:{
      tipoViaImovel:{
        type:String,
        //['Av','Rua']
      },
      nomeViaImovel:{
        type:String,
      },
    },
    caracteristicasConstrucao:{
      type:String,
           // ['Alvenaria', 'Taipa', 'Madeira', 'Outros']

    },

    tempoDeResidencia:{
      type: String,
      //'Menos de 5 Anos', 'Mais de 5 Anos'],
    },
    OutroImovel:{
      possuiOutroImovel:{
        type:Boolean,
      },
      qualOutroImovel:{
        type:String,
      },
    },
    tipoDeImovel:{
      type: String,
      //'Residencial', 'Residencial e Comercial', 'Comercial'],
    },
    /*
     CARACTERÍSTICAS/ DOCUMENTOS REFERENTE A OCUPAÇÃO/ DATA DO DOCUMENTO 
    */
    caracteristicaReferenteAOcupacao:{
      tipoDeCaracteristicaReferenteAOcupacao:{
        type: String,
        //'Termo de Ocupação', 'Recibo', 'Cessão de Direito', 'Invasão', 'Outro'],
      },//duvida se uso ou nao o enum
    },
    Observacao:{
      type: String,
    },
    dataDocumento:{
      type: Date,
      required:true,
    },
    

  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
regularizacaoImobiliariaSchema.plugin(toJSON);
regularizacaoImobiliariaSchema.plugin(paginate);


/**
 * @typedef RegularizacaoImobiliaria
 */
const RegularizacaoImobiliaria = mongoose.model('RegularizacaoImobiliaria', regularizacaoImobiliariaSchema);

module.exports = RegularizacaoImobiliaria;
