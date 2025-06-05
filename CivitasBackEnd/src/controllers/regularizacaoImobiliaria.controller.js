const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { regularizacaoImobiliarioService } = require('../services');

const create = catchAsync(async (req, res) => {
  const regularizacao = await regularizacaoImobiliarioService.create(req.body);
  res.status(httpStatus.CREATED).send(regularizacao);
});



module.exports = {
  create,
};
