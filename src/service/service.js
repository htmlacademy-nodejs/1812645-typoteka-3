'use strict';

const {getArrayOfArgv} = require(`../utils/utils`);
const {Cli} = require(`../service/cli`);
const {DEFAULT_COMMAND, USER_ARGV_INDEX, ExitCode} = require(`../constants`);

const exec = async () => {
  let result = 0;
  let serverRun = false;
  let arrayOfUserCommand = getArrayOfArgv(process.argv.slice(USER_ARGV_INDEX));

  if (arrayOfUserCommand.length === 0) {
    arrayOfUserCommand = [{[DEFAULT_COMMAND]: null}];
  }

  for (const userCommand of arrayOfUserCommand) {
    const command = Object.keys(userCommand)[0];
    const value = userCommand[command];

    result = await Cli[command].run(value);

    if (result !== ExitCode.success) {
      process.exit(ExitCode.error);
    }

    if (result === ExitCode.success && command === `--server`) {
      serverRun = true;
    }
  }

  if (!serverRun) {
    process.exit(ExitCode.success);
  }
};

exec()
  .then(() => console.log(`\n *** *** \n`));
