const formDataParser = (req, res, next) => {
  if (!req.body) {
    return next();
  }

  // Lista dos campos que o frontend envia como string JSON
  const jsonFields = [
    'acessoABeneficiosSociais',
    'composicaoFamiliar',
    'familiarComDeficiencia',
    'viaImovel',
    'OutroImovel',
    'caracteristicaReferenteAOcupacao',
  ];

  const parsedBody = { ...req.body };

  for (const key of jsonFields) {
    // Verifica se o campo existe no corpo da requisição e se é uma string
    if (parsedBody[key] && typeof parsedBody[key] === 'string') {
      try {
        // Tenta fazer o parse do valor para JSON
        parsedBody[key] = JSON.parse(parsedBody[key]);
      } catch (e) {
        // Se a conversão falhar, não faz nada. 
        // A validação do Joi irá pegar o erro de tipo se o dado estiver mal formatado.
        console.error(`Erro ao fazer parse do JSON para o campo: ${key}`);
      }
    }
  }

  // Substitui o req.body original pelo corpo com os campos parseados
  req.body = parsedBody;
  next();
};

module.exports = formDataParser;