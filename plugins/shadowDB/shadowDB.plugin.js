import { basename, join } from 'path'
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs'
import { deepStrictEqual } from 'assert'
const path = { basename, join }
const fs = { existsSync, readFileSync, statSync, writeFileSync }
const assert = { deepStrictEqual }


const plugin = {
  name: 'shadowDB',
  initialize,
  update
  // compare
  // updateDB
  // updateText
  // assembleType
  // assembleMarkers
}
const plugins = {}
const CREATED = 'createdAt'
const FINISHED = 'finished'
let options


function initialize (engine, userOptions) { // eslint-disable-line no-unused-vars
  const ct = { customTypes: {} }
  const m = { markers: {} }
  for (const plugin in engine.config) {
    if (engine.config[plugin].customTypes) ct.customTypes = {...ct.customTypes, ...engine.config[plugin].customTypes}
    if (engine.config[plugin].markers) m.markers = {...m.markers, ...engine.config[plugin].markers}
  }

  options = {...ct, ...m, identation: {...engine.config.parser.identation}}
  plugins.parser = engine.plugins.parser
}

async function update (file) {
  const filePath = path.join(process.env.INIT_CWD, file)
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`)

  const fileDB = path.join(process.env.INIT_CWD, '.' + path.basename(filePath).replace('.md', '.json'))
  let db = {}
  if (fs.existsSync(fileDB)) db = (await import(fileDB)).default

  const parsed = plugins.parser.parse(file)
  const fileStats = await fs.statSync(filePath)
  const fileModDate = new Date(fileStats.mtimeMs)

  const compared = compare(db, parsed.dict, fileModDate)
  updateDB(compared.newDB, fileDB) // no await
  updateText(compared.parsed, filePath) // no await

  return compared
}

function compare (stored, parsed, modDate) {
  const newDB = {}
  const added = {}
  const deleted = {}
  const changed = {}

  const IDs = new Set([...Object.keys(stored), ...Object.keys(parsed)])
  for (const id of IDs) {
    if (!stored[id]) {
      // ADD
      parsed[id][CREATED] = modDate
      newDB[id] = parsed[id]
      added[id] = parsed[id]
    }
    if (!parsed[id]) {
      // DEL
      stored[id][FINISHED] = modDate
      newDB[id] = stored[id]
      deleted[id] = stored[id]
    }
    if (stored[id] && parsed[id]) {
      // if (Object.keys(stored).length != Object.keys(parsed).length)
      // if (parsed.hash !== parsed.id) // main text changed
      try {
        assert.deepStrictEqual(stored[id], parsed[id])
        // SAME
        newDB[id] = stored[id]
      } catch (e) {
        // CHANGED
        newDB[id] = parsed[id]
        changed[id] = e
      }
    }
  }

  for (const id of IDs) {
    if (newDB[id].parent) newDB[id].parent = newDB[id].parent.id
    if (newDB[id].children) newDB[id].children = newDB[id].children.map((c) => c.id)
  }

  return {
    newDB,
    added,
    deleted,
    changed,
    stored,
    parsed
  }
}

async function updateDB (newDB, fileDB) {
  await fs.writeFileSync(fileDB, JSON.stringify(newDB, null, options.identation.indentSize || 2), { encoding: 'utf8' })
}

async function updateText (parsed, file) {
  let text = await fs.readFileSync(file, { encoding: 'utf8' })
  const identation = options.identation.insertSpaces ? ' '.repeat(options.identation.indentSize) : '\t'

  for (const id in parsed) {
    const line = parsed[id]
    const newLine = {
      identation: identation.repeat(line.identation),
      type: assembleType(line.type),
      name: line.name,
      markers: assembleMarkers(line),
      id: `${options.markers.id[0]}${id}${options.markers.id[1]}`
    }

    // assembleType part II
    if (newLine.type !== false) {
      const lineRegex = new RegExp(`^.*${line.name}.*$`, 'm')
      text = text.replace(lineRegex, `${newLine.identation}${newLine.type} ${newLine.name} ${newLine.markers} ${newLine.id}`)
    } else {
      const typeText = options.customTypes[line.type]
      const pattern = typeText.repeat(Math.ceil(newLine.name.length / typeText.length)).slice(0, newLine.name.length)
      const lineRegex = new RegExp(`^.*${line.name}.*$\n^.*$`, 'm')
      text = text.replace(lineRegex, `${newLine.identation}${newLine.name} ${newLine.markers} ${newLine.id}\n${newLine.identation}${pattern}`)
    }
  }

  await fs.writeFileSync(file, text, { encoding: 'utf8' })
}

function assembleType (type) {
  const typeText = options.customTypes[type]
  if (!typeText) return ''
  if (typeText.length <= 2) return typeText // not reordering ordered tasks/types right now
  else return false
}

function assembleMarkers (line) {
  const markers = {...options.markers}
  let L = []

  if (markers.id) delete markers.id // special marker right?
  for (const key in markers) {
    const marker = markers[key]

    if (line[key]) {
      if (marker.length == 1) L = [...L, line[key].map((m) => `${marker}${m}`)]
      else L.push(`${marker[0]}${line[key]}${marker[1]}`)
    }
  }

  return L.join(' ')
}


export default plugin
