const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Os arquivos serão salvos na pasta 'uploads/' na raiz do projeto
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Tipo de arquivo não suportado. Apenas JPEG, PNG e PDF são permitidos.'), false);
  }
};

// CORREÇÃO: Exporte a instância do multer diretamente.
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = upload;