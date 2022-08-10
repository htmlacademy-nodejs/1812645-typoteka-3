'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {ExitCode} = require(`../../constants`);

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

module.exports = {
  getArrayOfArgv,
  getRandomInt,
  shufflingArray,
  getRandomDate,
  conversionToString,
  printOffers,
  readFile,
  writeFile,
};
