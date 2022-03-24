'use strict';

const {getArrayOfArgv} = require(`../service/utils/utils`);
const {Cli} = require(`../service/cli`);
const {DEFAULT_COMMAND, USER_ARGV_INDEX, ExitCode} = require(`../service/const/constants`);

let arrayOfUserCommand = getArrayOfArgv(process.argv.slice(USER_ARGV_INDEX));

if (arrayOfUserCommand.length === 0) {
  arrayOfUserCommand = [{[DEFAULT_COMMAND]: null}];
}

arrayOfUserCommand.forEach((userCommand) => {
  const command = Object.keys(userCommand)[0];
  const value = userCommand[command];

  const result = Cli[command].run(value);
  if (result !== ExitCode.success) {
    process.exit(ExitCode.error);
  }
});
process.exit(ExitCode.success);
