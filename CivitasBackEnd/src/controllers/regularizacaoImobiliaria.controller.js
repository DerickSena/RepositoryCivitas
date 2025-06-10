const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { regularizacaoImobiliarioService } = require('../services');

const create = catchAsync(async (req, res) => {
  const caminhosAnexos = req.files ? req.files.map((file) => file.path) : [];
  const regularizacaoData = { ...req.body };

  // --- Converte os valores recebidos para o formato do Banco de Dados ---

  // Converte "Sim"/"Não" para Booleano
  if (regularizacaoData.acessoABeneficiosSociais) {
    regularizacaoData.acessoABeneficiosSociais.possuiBeneficiosSociais =
      regularizacaoData.acessoABeneficiosSociais.possuiBeneficiosSociais === 'Sim';
  }
  if (regularizacaoData.familiarComDeficiencia) {
    regularizacaoData.familiarComDeficiencia.possuiFamiliarComDeficiencia =
      regularizacaoData.familiarComDeficiencia.possuiFamiliarComDeficiencia === 'Sim';
  }
  if (regularizacaoData.OutroImovel) {
    regularizacaoData.OutroImovel.possuiOutroImovel =
      regularizacaoData.OutroImovel.possuiOutroImovel === 'Sim';
  }

  // Garante que campos numéricos que viraram número sejam strings
  const camposParaConverterParaString = [
    'tituloEleitoralTitular', 'rgTitular', 'cadUnicoTitular', 
    'loteImovel', 'quadraImovel', 'tempoDeResidencia'
  ];
  camposParaConverterParaString.forEach(campo => {
    if (regularizacaoData[campo] !== undefined) {
      regularizacaoData[campo] = String(regularizacaoData[campo]);
    }
  });

  // Adiciona os caminhos dos anexos
  regularizacaoData.caminhoAnexo = caminhosAnexos;

  // --- Limpa dados opcionais que não foram preenchidos ---
  if (regularizacaoData.acessoABeneficiosSociais?.possuiBeneficiosSociais === false) {
    delete regularizacaoData.acessoABeneficiosSociais.quaisBeneficiosSociais;
  }
  if (regularizacaoData.familiarComDeficiencia?.possuiFamiliarComDeficiencia === false) {
    delete regularizacaoData.familiarComDeficiencia.quemPossuiDeficiencia;
  }
  if (regularizacaoData.OutroImovel?.possuiOutroImovel === false) {
    delete regularizacaoData.OutroImovel.qualOutroImovel;
  }
  if (regularizacaoData.caracteristicaReferenteAOcupacao?.tipoDeCaracteristicaReferenteAOcupacao !== 'Outro') {
    delete regularizacaoData.caracteristicaReferenteAOcupacao.outroTipoDocumentoOcupacao;
  }

  const regularizacao = await regularizacaoImobiliarioService.create(regularizacaoData);
  res.status(httpStatus.CREATED).send(regularizacao);
});

module.exports = {
  create,
};