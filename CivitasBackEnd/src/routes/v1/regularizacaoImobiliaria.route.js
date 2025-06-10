const express = require('express');
const validate = require('../../middlewares/validate');
const upload = require('../../middlewares/upload'); // Agora importa a instância correta do multer
const formData = require('../../middlewares/formData');
const { regularizacaoImobiliarioValidation } = require('../../validations');
const { regularizacaoImobiliariaController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    // Esta chamada agora funcionará corretamente
    upload.array('anexosDocumentos', 10), // Limite de 10 arquivos
    formData,
    validate(regularizacaoImobiliarioValidation.create),
    regularizacaoImobiliariaController.create
  );

module.exports = router;