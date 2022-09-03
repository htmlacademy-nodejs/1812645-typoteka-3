'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {
  ExitCode,
} = require(`../constants`);

const getArrayOfArgv = (argv) => {
  let arr = [];
  argv.forEach((item, index) => {
    if (item.includes(`--`)) {
      arr.push({
        [argv[index]]: Number.parseInt(argv[index + 1], 10) || null,
      });
    }
  });
  return arr;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shufflingArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [array[i], array[randomPosition]] = [array[randomPosition], array[i]];
  }
  return array;
};

const getRandomDate = (rangeOfDays) => {
  const count = +rangeOfDays || 1;
  const today = new Date(Date.now());

  today.setDate(today.getDate() - getRandomInt(0, count)).toString();

  return today;
};

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    console.log(chalk.green(`\t Read file ${filePath}`));
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(`\t ${error.message}`));
    return error;
  }
};

const writeFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    console.log(chalk.green(`\n\t Operation success. File "${filePath}" created.`));
    return ExitCode.success;
  } catch (error) {
    console.error(chalk.red(`\n\t ${error.message}`));
    return error;
  }
};

const copyFile = async (oldFilePath, newFilePath) => {
  try {
    await fs.copyFile(oldFilePath, newFilePath);
    return ExitCode.success;
  } catch (error) {
    return error;
  }
};

const deleteFile = async (fileName) => {
  try {
    await fs.unlink(fileName);
    return ExitCode.success;
  } catch (error) {
    return error;
  }
};

const movingFile = async (fileName) => {
  if (!fileName) {
    return;
  }
  const relativePath1 = path.join(`../express/upload/img`, fileName);
  const relativePath2 = path.join(`../express/public/img`, fileName);

  const pathFrom = path.resolve(__dirname, relativePath1);
  const pathTo = path.resolve(__dirname, relativePath2);
  await copyFile(pathFrom, pathTo);
  await deleteFile(pathFrom);
};

const conversionToString = (arr) => {
  return JSON.stringify(arr);
};

const printOffers = (arr) => {
  arr.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      console.log(chalk.magenta(key) + `: ` + obj[key]);
    });
    console.log(``);
  });
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const prepareErrorsToArray = (errors) => {
  let arr = [];
  for (let value of Object.values(errors.response.data)) {
    arr.push(value);
  }

  return arr;
};

const prepareErrors = (errors) => {
  return errors.response.data;
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports = {
  getArrayOfArgv,
  getRandomInt,
  shufflingArray,
  getRandomDate,
  conversionToString,
  printOffers,
  readFile,
  writeFile,
  getPictureFileName,
  prepareErrorsToArray,
  prepareErrors,
  ensureArray,
  copyFile,
  deleteFile,
  movingFile,
};
