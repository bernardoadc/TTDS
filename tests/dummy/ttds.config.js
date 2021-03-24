export default {
  parser: { // codificação personalizavel
    identation: {
      indentSize: 2,
      insertSpaces: true
    },
    comments: {
      inline: '//',
      multilines: {
        open: '/*',
        close: '*/'
      }
    },
    customTypes: {
      'task.unordered': '*',
      'task.ordered': ')',
      objetivos: '->',
      status: '---',
      inlineStatus: '@'
    },
    markers: {
      id: '[]',
      pkp: '{}',
      tags: '#'
    }
  }
/*  styler: {}, // GUI (padrao, mas alguem pode personalizar dps tbm)
  history: {}, // timeline e start + finish
  pkp: { // atribuir numero em pokerpoints
    markers: {
      pkp: '{}'
    },
    scale: [1, 2, 3, 5, 8, 13, 23, 37, 61, 99],
    unit: 'kp'
  },
  'B/C': { // usar kp para calcular relevancia e tc
    markers: {
      values: '{}',
      costs: '{}'
    }
  },
  timer: { // registrar e somar tempos gastos
    format: 'h"h" m"m" s"s"'
  },
  kanban: { // status de kanban
    customtypes: {
      kanbanStatus: '---',
      inlineKanbanStatus: '@'
    }
  },
  tags: { // adicionar tags aos itens para posterior visualização agrupada
    markers: {
      tags: '#'
     }
  }
*/
}
