function cli (api, program) {
  program
    .command('update <file>')
    .alias('u')
    .description('update internal DB')
    .action(function (...args) {
      if (process.env.NODE_ENV == 'debug') console.info(`CMD => ${[...args].join(', ')}`)
      api.update(...args)
    }).on('--help', function () {
      console.log('')
      console.log('Examples:')
      console.log('')
      console.log('  ttds u ./TTDS.example.md')
      console.log('  ttds update ./TTDS.example.md')
    })
}

export default cli
