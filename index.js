#! /usr/bin/env node
import program from 'commander'
import pacote from './package.json'
import lib from './lib/index.js'

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
if (process.env.DEBUG) global.debug = process.env.DEBUG
else global.debug = false


program
  .version(pacote.version, '-v, --version')
  .description('[97mTTS Engine - Text To-Do System[0m')

await lib(program) // eslint-disable-line

program
  .on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
    process.exit(1)
  }).on('option:verbose', function () {
    process.env.VERBOSE = this.verbose
  })

program.parse(process.argv)
if (!program.args.length) program.help()
