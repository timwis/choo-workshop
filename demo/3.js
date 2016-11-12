const extend = require('xtend')
const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.model({
  state: {
    todos: []
  },
  reducers: {
    addTodo: (data, state) => {
      const newTodos = state.todos.slice()
      newTodos.push(data)
      return { todos: newTodos }
    }
  }
})

const view = (state, prev, send) => {
  return html`
    <div>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.map((todo) => html`<li>${todo.title}</li>`)}
      </ul>
    </div>`
  function onSubmit (e) {
    const input = e.target.children[0]
    send('addTodo', { title: input.value })
    input.value = ''
    e.preventDefault()
  }
}

app.router((route) => [
  route('/', view)
])

const tree = app.start()
document.body.appendChild(tree)
