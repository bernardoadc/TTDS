import path from 'path'

import corePlugins from './core.plugins.js'
const lib = {
  getPackage,
  registerPlugin,
  loadUserPlugins,
  config: {},
  plugins: {}
}


async function initialize () {
  const config = await import(path.join(process.env.INIT_CWD, 'ttds.config.js')) // unified
  lib.config = config.default
  await loadCorePlugins()
  await loadUserPlugins()

  return lib.plugins
}

async function getPackage (pacote) {
  const json = await import(path.join(pacote, 'package.json'))
  const main = json.main
  return import(path.join(pacote, main))
}

function registerPlugin (name, pluginApi, userOptions) {
  pluginApi.initialize(userOptions)
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


export default initialize
