import path from 'path'
import chalk from 'chalk'

import corePlugins from './core.plugins.js'
const lib = {
  // getPackage
  // registerPlugin
  // loadUserPlugins
  // checkDependencies
  config: {},
  plugins: {}
}
const dependencies = {}


async function initialize () {
  const config = await import(path.join(process.env.INIT_CWD, 'ttds.config.js')) // unified
  lib.config = config.default
  await loadCorePlugins()
  await loadUserPlugins()
  checkDependencies()

  return lib.plugins
}

async function getPackage (pacote) {
  const json = await import(path.join(pacote, 'package.json'))
  const name = json.main.split('.').shift() // package's name does'nt allow capitallized letters
  const main = json.main
  dependencies[name] = json.pluginDependencies || []
  return import(path.join(pacote, main))
}

function registerPlugin (name, pluginApi, userOptions) {
  pluginApi.initialize(lib, userOptions) // lib is useful for plugins that have cross-plugin dependencies or options
  lib.plugins[name] = pluginApi
}

async function loadCorePlugins () {
  for (const pluginName of corePlugins) {
    const pluginPath = path.join(process.cwd(), 'plugins', pluginName)
    const pluginApi = await getPackage(pluginPath)
    registerPlugin(pluginName, pluginApi.default, lib.config[pluginName])
  }
}

async function loadUserPlugins () {
  for (const plugin in lib.config) {
    if (!corePlugins.includes(plugin)) {
      const pluginPath = path.join(process.env.INIT_CWD, 'node_modules', `ttds-${plugin}`)
      const pluginApi = await getPackage(pluginPath)
      registerPlugin(plugin, pluginApi.default, lib.config[plugin])
    }
  }
}

function checkDependencies () {
  const errors = []

  for (const plugin in dependencies) {
    for (const dependency of dependencies[plugin]) {
      if (!lib.plugins[dependency]) errors.push(`Plugin ${plugin} requires ${dependency} plugin`)
    }
  }

  if (errors.length) throw new Error(chalk.red.bold('\nPlugin dependencies are missing!\n') + chalk.yellow(errors.join('\n')))
}


export default initialize
