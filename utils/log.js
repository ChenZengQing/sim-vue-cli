const chalk = require('chalk')
const logSymbols = require('log-symbols')

module.exports = {
    log: (text) => console.log(chalk.green(text)),
    success: (text) => console.log(logSymbols.success, chalk.green(text)),
    info: (text) => console.log(chalk.gray(text)),
    bash: (text) => console.log(chalk.cyan(`$ ${text}`)),
    warning: (text) => console.log(logSymbols.warning, chalk.yellow(text)),
    error: (text) => console.log(logSymbols.error, chalk.red(text)),
    table: (tableData) => console.table(tableData),
}
