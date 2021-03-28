import path from 'path'


const plugin = {
  name: 'shadowDB',
  initialize,
  update
  // compare
}
let options

function initialize () {}

async function update (file) {
  const fileDB = '.' + file.replace('.md', '.json5')
  const db = await import(path.join(process.env.INIT_CWD, fileDB))
  const parsed =

  compare(db, parsed)


  return false
}

function compare (stored, parsed) {
}


export default plugin
