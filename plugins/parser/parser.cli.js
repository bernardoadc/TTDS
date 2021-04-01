function cli (api, program) {
  program
    .command('parse <file>')
    .alias('p')
    .description('parse text to-do')
    .action(function (...args) {
      if (process.env.NODE_ENV == 'debug') console.info(`CMD => ${[...args].join(', ')}`)
      api.parse(...args)
    }).on('--help', function () {
      console.log('')
      console.log('Examples:')
      console.log('')
      console.log('  ttds p ./TTDS.example.md')
      console.log('  ttds parse ./TTDS.example.md')
    })
}

export default cli
