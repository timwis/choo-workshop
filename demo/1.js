const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.model({
  state: {
    todos: [
      { title: 'Buy milk' },
      { title: 'Call mum' }
    ]
  }
})

const view = (state, prev, send) => {
  return html`
    <div>
      <h1>Todos</h1>
      <ul>
        ${state.todos.map((todo) => html`<li>${todo.title}</li>`)}
      </ul>
    </div>`
}

app.router((route) => [
  route('/', view)
])

const tree = app.start()
document.body.appendChild(tree)
