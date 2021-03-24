import test from 'ava'
import lib from '../lib/index.js'


test.before(async function (t) {
  t.context.api = await lib()
})


/*test.skip('loaded', function (t) {
  //se carregou plugin
})*/

test('parse exec', function (t) {
  //se executa função parse
  const api = t.context.api
  const parsed = api.parser.parse('./TTDS.example.md')
  console.log(parsed)

  t.is(1, 1)
})

/*test.skip('parse ok', function (t) {
  //passar dados dummy e ver se retorna como previsto
})*/
