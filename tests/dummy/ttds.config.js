export default {
  parser: { // codificação personalizavel
    indentSize: 2,
    insertSpaces: true,
    'comments.inline': '//',
    'comments.multilines.open': '/*',
    'comments.multilines.close': '*/',
    id: '[]',
    'tasks.unordered': '*',
    'tasks.ordered': ')',
    customtypes: {
      objetivos: '->'
    }
  }
/*  styler: {}, // GUI (padrao, mas alguem pode personalizar dps tbm)
  history: {}, // timeline e start + finish
  pkp: { // atribuir numero em pokerpoints
    marker: '{}',
    scale: [1, 2, 3, 5, 8, 13, 23, 37, 61, 99],
    unit: 'kp'
  },
  'B/C': { // usar kp para calcular relevancia e tc
    values: '{}',
    costs: '{}'
  },
  timer: { // registrar e somar tempos gastos
    format: 'h"h" m"m" s"s"'
  },
  kanban: { // status de kanban
    status: '##',
    inlineStatus: '@'
  },
  tags: '#' // adicionar tags aos itens para posterior visualização agrupada
*/
}
