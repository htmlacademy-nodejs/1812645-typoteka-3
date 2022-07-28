'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
let data = [];

const getMockData = async (filePath) => {
  if (data.length > 0) {
    return data;
  }

  try {
    const content = await fs.readFile(filePath, `utf-8`);
    console.log(chalk.green(`\t Read file ${filePath}`));
    data = content.trim().split(`\n`);
  } catch (error) {
    // console.error(chalk.red(`\t ${error.message}`));
    return error;
  }

  return data;
};

module.exports = getMockData;
