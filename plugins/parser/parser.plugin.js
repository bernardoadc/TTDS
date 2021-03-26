import fs from 'fs'
import path from 'path'
import { crc16ccitt } from 'crc'


import defaultOptions from './default.config'

const plugin = {
  initialize,
  // hash
  parse
  // clean
  // doParse
  // getType,
  // parseMarkers,
  // updateObjDic
}
let options

function initialize (userOptions) {
  options = {...defaultOptions, ...userOptions}
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
  data = data.replace(/^\s+?$(\r?\n)*/gm, '\n')

  // treat underscores
  data = data.replace(/^([ \t]*)(.+)\r?\n[ \t]*([-=¨"']){3,}$/, '$1$3$3$3 $2')

  return data
}

function doParse (data, file) {
  data = clean(data)
  const identationRegexp = new RegExp(options.insertSpaces ? ` {${options.indentSize}}` : '\t')

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

    const obj = { // hash do nome
      // references
      file: file,
      id: hash(line.name),
      parent: null, // dict
      children: [], // monta hierarquia
      // main properties
      name: line.name,
      type: getType(line.type),
      ...parseMarkers(line.markers)
    }

    dict[obj.id] = obj

    const ident = line.identation.split(identationRegexp).length - 1 // replace(/([ \t]*).+/, '$1')
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

// get tasks
// get tasks
// for types in customTypes

/*
parser: {
  id: '[]',
  'tasks.unordered': '*',
  'tasks.ordered': ')',
  customtypes: {
    objetivos: '->'
  }
}
*/

function getType () {

}

function parseMarkers () {

}


export default plugin
