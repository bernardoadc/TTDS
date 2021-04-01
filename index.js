#! /usr/bin/env node
import program from 'commander'
import lib from './lib/index.js'
const api = await lib() // eslint-disable-line

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
if (process.env.DEBUG) global.debug = process.env.DEBUG
else global.debug = false


program
  .version('0.1.0', '-v, --version')
  .description('[97mTTS Engine - Text To-Do System[0m')

program
  .command('parse') //  <file>
  .alias('p')
  .description('parse text to-do')
  .action(function (file) { // eslint-disable-line no-unused-vars
    if (process.env.NODE_ENV == 'debug') console.info(`CMD => ${[...arguments].join(', ')}`)
  }).on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log('')
  })

  program
  .command('update') //  <file>
  .alias('u')
  .description('update internal DB')
  .action(function (file) { // eslint-disable-line no-unused-vars
    if (process.env.NODE_ENV == 'debug') console.info(`CMD => ${[...arguments].join(', ')}`)
    api.parser.parse(...arguments)
  }).on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log('')
  })

program
  .on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
    process.exit(1)
  }).on('option:verbose', function () {
    process.env.VERBOSE = this.verbose
  })

program.parse(process.argv)
if (!program.args.length) program.help()
