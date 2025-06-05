const httpStatus = require('http-status');
const { RegularizacaoImobiliaria } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const create = async (userBody) => {
  return RegularizacaoImobiliaria.create(userBody);
};



module.exports = {
  create,
};
