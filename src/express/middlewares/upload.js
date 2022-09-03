'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const {
  UPLOAD_DIR,
  FILE_TYPES
} = require(`../../constants`);

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirAbsolute),
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({storage, fileFilter, limits: {
  fileSize: 5 * 1024 * 1024
}});

module.exports = upload;
