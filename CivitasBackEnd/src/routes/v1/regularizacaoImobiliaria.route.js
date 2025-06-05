const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { regularizacaoImobiliarioValidation } = require('../../validations');
const { regularizacaoImobiliariaController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(validate(regularizacaoImobiliarioValidation.create), regularizacaoImobiliariaController.create);

module.exports = router;
