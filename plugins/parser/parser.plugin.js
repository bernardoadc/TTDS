import { readFileSync } from 'fs'
import { join } from 'path'
import { crc16ccitt } from 'crc'
import cli from './parser.cli'
import defaultOptions from './default.config'
const fs = { readFileSync }
const path = { join }


const plugin = {
  name: 'parser',
  initialize,
  // hash
  parse
  // clean
  // doParse
  // getType
  // parseMarkers
}
let options

function initialize (engine, userOptions, CLI) {
  const ct = { customTypes: {} }
  const m = { markers: {} }
  for (const plugin in engine.config) {
    if (engine.config[plugin].customTypes) ct.customTypes = {...ct.customTypes, ...engine.config[plugin].customTypes}
    if (engine.config[plugin].markers) m.markers = {...m.markers, ...engine.config[plugin].markers}
  }

  options = {...defaultOptions, ...userOptions, ...ct, ...m}
  cli(plugin, CLI)
}

function hash (what) {
  return crc16ccitt(what).toString(36)
}

function parse (file) {
  const data = fs.readFileSync(path.join(process.env.INIT_CWD, file), {encoding: 'utf8'})

  const parsed = doParse(data, file)

  return parsed
}

function clean (data) {
  // remove comments inline
  let escaped = options.comments.inline.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const commentsInline = new RegExp(`${escaped}.+$`, 'g')
  data = data.replace(commentsInline, '')

  // remove comments multiline
  escaped = {
    open: options.comments.multilines.open.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
    close: options.comments.multilines.close.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  }
  const commentsMultiline = new RegExp(`${escaped.open}(.+\r?\n?).+?${escaped.close}`, 'gm')
  data = data.replace(commentsMultiline, '')

  // remove extra lines
  //[ \t]*
  data = data.replace(/^\s+?$(\r?\n)*/gm, '\n')

  // treat underscores
  data = data.replace(/([ \t]*)(.+)\r?\n[ \t]*([-=¨"']){3,}/, '$1$3$3$3 $2')

  return data
}

function doParse (data) { //, file
  data = clean(data)
  const identationRegexp = new RegExp(options.identation.insertSpaces ? ` {${options.identation.indentSize}}` : '\t')

  const levels = []
  const dict = {} // hashes
  const root = { // tree
    children: []
  }

  const lines = data.split(/\r?\n/)
  lines.pop() // last line
  for (let line of lines) {
    let match = line.match(/^([ \t]*)(.{1,3}) (.+)(?: ((?:[[#{].+)+))$/)
    if (!match) match = line.match(/^([ \t]*)(.{1,3}) (.+)$/)
    line = match.reduce((r, v, i) => (r[['original', 'identation', 'type', 'name', 'markers'][i]] = v, r), {}) // eslint-disable-line no-sequences, no-return-assign

    const ident = line.identation.split(identationRegexp).length - 1 // replace(/([ \t]*).+/, '$1')
    const obj = { // hash do nome
      // references
      // file: file,
      identation: ident, // useful to re-write text file
      hash: hash(line.name), // useful to see if changed
      id: hash(line.name),
      parent: null, // dict
      children: [], // monta hierarquia
      // main properties
      name: line.name,
      type: getType(line.type),
      ...parseMarkers(line.markers)
    }

    dict[obj.id] = obj

    levels[ident] = obj
    if (ident > 0) {
      obj.parent = levels[ident - 1]
      levels[ident - 1].children.push(obj)
    } else {
      root.children.push(obj)
    }
  }

  return {
    dict,
    tree: root
  }
}

function getType (asText) {
  if (asText.slice(-1) == options.customTypes['task.ordered']) return 'task.ordered'
  for (const key in options.customTypes) {
    if (asText == options.customTypes[key]) return key
  }
}

function parseMarkers (markers) {
  if (markers) return markers.split(' ').reduce(function (r, m) {
    for (const key in options.markers) {
      const marker = options.markers[key]
      if (m[0] == marker[0]) {
        if (marker.length == 1) {
          if (!r[key]) r[key] = []
          r[key].push(m.slice(1))
        } else if (marker.length == 2 && m.slice(-1) == marker[1]) r[key] = m.slice(1, -1)
      }
    }

    return r
  }, {})
}


export default plugin
