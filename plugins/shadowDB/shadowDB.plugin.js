import path from 'path'


const plugin = {
  name: 'shadowDB',
  initialize,
  update
  // compare
}
const plugins = {}
let options

function initialize (engine, userOptions, allOptions) { // eslint-disable-line no-unused-vars
  plugins.parser = engine.plugins.parser
  options = allOptions
}

async function update (file) {
  const fileDB = '.' + file.replace('.md', '.json5')
  const db = await import(path.join(process.env.INIT_CWD, fileDB))
  const parsed = plugins.parser.parse(file)

  compare(db, parsed)


  return false
}

function compare (stored, parsed) {
}


export default plugin
