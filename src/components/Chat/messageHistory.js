export default [
  { type: 'text', author: `me`, id: 0, data: { text: `Проблема` } },
  { type: 'text', author: `support`, id: 1, data: { text: `Что за проблема?` } },
  { type: 'text', author: `me`, id: 0, data: { text: `Сложная` } },
  { type: 'system', id: 13, data: { text: 'Вы переведены на другого оператора', meta: '04-07-2018 15:57' } },
  { type: 'text', author: `support`, id: 1, data: { text: `Добрый день, все решу` } },
  { type: 'text', author: `support`, id: 21, data: { text: `Сообщение с вариантами ответов` }, suggestions: ["Вариант сообщения 1", "Вариант сообщения 2"] }
]
