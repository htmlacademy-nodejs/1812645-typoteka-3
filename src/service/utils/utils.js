'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {ExitCode} = require(`../const/constants`);

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
    console.log(`readFile`);
    const content = await fs.readFile(filePath, `utf-8`).catch(console.error);
    console.log(`readFile +`);
    return content.trim().split(`n`);
  } catch (error) {
    console.error(error);
    return error;
  }
}

const writeFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content);
    console.log(chalk.green(`\tOperation success. File created.`));
    return ExitCode.success;
  } catch (error) {
    console.error(chalk.red(`\tCan't write data to file...`));
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
