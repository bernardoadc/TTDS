import test from 'ava'
import api from '../lib/index.js'


/*test.skip('loaded', function (t) {
  //se carregou plugin
})*/

test('parse exec', function (t) {
  //se executa função parse
  api.parse('./dummy/TTDS.example.md')
})

/*test.skip('parse ok', function (t) {
  //passar dados dummy e ver se retorna como previsto
})*/
