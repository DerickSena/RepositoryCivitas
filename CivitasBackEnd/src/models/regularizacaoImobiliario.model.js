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
      trim: true,
      uppercase :true,
      required:[true, 'BK nomeTitular é obrigatório']
    },
    cpfTitular:{
      type:String,
      trim:true,
      required:[true, 'BK cpfTitular é obrigatório']
    },
    dataNascimentoTitular:{
      type: Date,
      trim: true,
      required:[true, 'BK dataNascimentoTitular é obrigatório']
    },
    profissaoTitular:{
      type: String,
      trim: true,
      uppercase :true,
      required:[true, 'BK profissaoTitular é obrigatório']
    },
    tituloEleitoralTitular:{
      type: String,
      trim: true,
      required:[true, 'BK tituloEleitoralTitular é obrigatório']
    },
    rgTitular:{
      type: String,
      trim: true,
      required:[true, 'BK rgTitular é obrigatório']
    },
    contatoTitular:{
      type: String,
      trim: true,
      required:[true, 'BK contatoTitular é obrigatório']
    },
    escolaridadeTitular:{
      type: String,
      trim: true,
      uppercase: true,
      required:[true, 'BK escolaridadeTitular é obrigatório']
    },
    cadUnicoTitular:{
      type: String,
      trim: true,
      required:[true, 'BK cadUnicoTitular é obrigatório']
    },
    estadoCivilTitular:{
      type: String,
      required:[true, 'BK estadoCivilTitular é obrigatório']
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
      required:[true, 'BK rendaFamiliar é obrigatório']
      //'Menos de 1 Salário','De 1 a 3 Salários','De 3 a 5 Salários','Mais de 5 Salários'
    },


    acessoABeneficiosSociais:{
      possuiBeneficiosSociais: {
        type:Boolean,
        required:[true, 'BK possuiBeneficiosSociais é obrigatório']
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
        required:[true, 'BK possuiFamiliarComDeficiencia é obrigatório']
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
      required:[true, 'BK loteamentoImovel é obrigatório']
    },
    loteImovel:{
      type: String,
      required:[true, 'BK loteImovel é obrigatório']
    },
    quadraImovel:{
      type: String,
      required:[true, 'BK quadraImovel é obrigatório']
    },
    viaImovel:{
      tipoViaImovel:{
        type:String,
        required:[true, 'BK tipoViaImovel é obrigatório']
        //['Av','Rua']
      },
      nomeViaImovel:{
        type:String,
      },
    },
    caracteristicasConstrucao:{
      type:String,
      required:[true, 'BK caracteristicasConstrucao é obrigatório']
           // ['Alvenaria', 'Taipa', 'Madeira', 'Outros']

    },

    tempoDeResidencia:{
      type: String,
      required:[true, 'BK tempoDeResidencia é obrigatório']
      //'Menos de 5 Anos', 'Mais de 5 Anos'],
    },
    OutroImovel:{
      possuiOutroImovel:{
        type:Boolean,
        required:[true, 'BK possuiOutroImovel é obrigatório']
      },
      qualOutroImovel:{
        type:String,
      },
    },
    tipoDeImovel:{
      type: String,
      required:[true, 'BK tipoDeImovel é obrigatório']
      //'Residencial', 'Residencial e Comercial', 'Comercial'],
    },
    /*
     CARACTERÍSTICAS/ DOCUMENTOS REFERENTE A OCUPAÇÃO/ DATA DO DOCUMENTO 
    */
    caracteristicaReferenteAOcupacao:{
      tipoDeCaracteristicaReferenteAOcupacao:{
        type: String,
        required:[true, 'BK tipoDeCaracteristicaReferenteAOcupacao é obrigatório']
        //'Termo de Ocupação', 'Recibo', 'Cessão de Direito', 'Invasão', 'Outro'],
      },//duvida se uso ou nao o enum
    },
    Observacao:{
      type: String,
    },
    dataDocumento:{
      type: Date,
      required:[true, 'BK dataDocumento é obrigatório']
    },
    caminhoAnexo: {
      type: [String], // Altere para um array de Strings
      trim: true,
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
