#! /usr/bin/env node
import program from 'commander'
import lib from './lib/index.js'

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
if (process.env.DEBUG) global.debug = process.env.DEBUG
else global.debug = false


program
  .version('0.1.0', '-v, --version')
  .description('[97mTTS Engine - Text To-Do System[0m')

program
  .command('cmd <param> [optional]')
  .alias('c')
  .description('')
  .action(function (param, optional) {
    if (process.env.NODE_ENV == 'debug') console.info(`CMD => ${[...arguments].join(', ')}`)
    lib.cmd(...arguments)
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
