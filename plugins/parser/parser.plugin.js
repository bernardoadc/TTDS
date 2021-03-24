import fs from 'fs'
import path from 'path'


import defaultOptions from './default.config'

const plugin = {
  initialize,
  parse
}
let options

function initialize (userOptions) {
  options = {...defaultOptions, ...userOptions}
}

function parse (file) {
  const data = fs.readFileSync(path.join(process.env.INIT_CWD, file), {encoding: 'utf8'})

  return data
}


export default plugin
