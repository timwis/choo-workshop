# choo: the good parts of react & redux without the boilerplate

Tim Wisniewski

Chief Data Officer, City of Philadelphia

@timwis -- tim@timwis.com

Repo: github.com/yoshuawuyts/choo

---
## Outline

1. Quick poll
2. What you'll get out of this session
3. Why choo?
4. Dependencies
5. Your first app

---
## Quick poll

1. Software devs?
2. Built an app in JS?
3. Used react or redux?

---
## What you'll get out of this session

- Build a basic todo app in a modern, functional front-end framework
- We'll cover 90% of the library's footprint
- The whole workshop is written down so you can pick it up later

---
## Why choo?

```javascript
const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.model({
  state: { title: 'Not quite set yet' },
  reducers: {
    update: (data, state) => ({ title: data })
  }
})

const mainView = (state, prev, send) => html`
  <main>
    <h1>Title: ${state.title}</h1>
    <input
      type="text"
      oninput=${(e) => send('update', e.target.value)}>
  </main>
`

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
```

???

- 5kb
- FUNctional (transparent side effects, immutable, uni-directional data flow)
- Small api footprint (easy to remember)
- Minimal tooling
- Just JavaScript

---
## Assumptions

- You have NodeJS w/npm
- Concept of **models** and **views** (as in MVC)
- Okay with a couple new ES6 features (const, arrow functions, template strings)

### Backup plan

http://c9.io

---
## Your first app

1. github.com/yoshuawuyts/choo
2. Click **Handbook**
3. Click **02 your first app**

https://yoshuawuyts.gitbooks.io/choo/content/02_your_first_app.html

---
### Boilerplate

```bash
npm init --yes
```

```bash
npm install --save choo
```

---
### Rendering data

```javascript
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
```

???

- Models are where **state** is contained and where methods for
  updating the state are defined
- Views are just functions that return a DOM tree of elements.
  They are passed the current state, the previous state, and a
  callback function that can be used to change the state.

---
### Running the app

```bash
npm install --global budo
```

```bash
budo index.js --live --open
```
or on **c9.io**:
```bash
budo index.js --port $PORT
```

```
http://workspace-username.c9users.io
```

---
### Adding items

```javascript
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
```

```javascript
const view = (state, prev, send) => {
  return html`
    <div>
      <form onsubmit=${(e) => {
        send('addTodo', { title: e.target.children[0].value })
        e.preventDefault()
      }}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.map((todo) => html`<li>${todo.title}</li>`)}
      </ul>
    </div>`
}
```

???

- First thought might be to `.push()` into `state.todos`
- Immutability makes a copy, alters it, returns the copy
- Allows us to compare state over time
- Try it out! Woah!

---
### Adding items

```javascript
const view = (state, prev, send) => {
  return html`
    <div>
      <form onsubmit=${(e) => {
        const input = e.target.children[0]
        send('addTodo', { title: input.value })
        input.value = ''
        e.preventDefault()
      }}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.map((todo) => html`<li>${todo.title}</li>`)}
      </ul>
    </div>`
}
```

Yikes...

???

- Notice it doesn't reset the text in your input

---
### Adding items

```javascript
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
```

Ah, that's better.

---
### Completion status

```bash
npm install xtend
```

```javascript
const extend = require('xtend')
const choo = require('choo')
const html = require('choo/html')
const app = choo()
```

---
### Completion status

```javascript
app.model({
  state: {
    todos: []
  },
  reducers: {
    addTodo: (data, state) => {
      const todo = extend(data, {
        completed: false
      })
      const newTodos = state.todos.slice()
      newTodos.push(todo)
      return { todos: newTodos }
    }
  }
})
```

???

- Now new items will be stored as `{ title: 'Our title', complete: false }`

---
### Completion status

```javascript
const view = (state, prev, send) => {
  return html`
    <div>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.map((todo) => html`
          <li>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} />
            ${todo.title}
          </li>`)}
      </ul>
    </div>`

  function onSubmit (e) {
    . . .
}
```

???

- You'll notice, though, that adding new items resets the checkboxes
  because checking them doesn't do anything
---
### Completion status

```javascript
const view = (state, prev, send) => {
  return html`
    <div>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        ${state.todos.map((todo, index) => html`
          <li>
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange=${(e) => {
              const updates = { completed: e.target.checked }
              send('updateTodo', { index: index, updates: updates })
            }} />
            ${todo.title}
          </li>`)}
      </ul>
    </div>`

  function onSubmit (e) {
    . . .
}
```

???

- State stores todos as an array
- To update, we need to know index
- Here we pass `index` and `updates` to reducer

---
### Completion status

```javascript
app.model({
  state: {
    todos: []
  },
  reducers: {
    addTodo: (data, state) => {
      // ...
    },
    updateTodo: (data, state) => {
      const newTodos = state.todos.slice()
      const oldItem = newTodos[data.index]
      const newItem = extend(oldItem, data.updates)
      newTodos[data.index] = newItem
      return { todos: newTodos }
    }
  }
})
```

???

- Here we create the reducer to update the state,
  making a copy and returning it
- Now your app maintains completed state, but refreshing
  will lose all items

---
### Effects

- Effects are similar to reducers except instead of modifying
  the state they cause side effects by interacting servers,
  databases, DOM APIs, etc. Often they'll call a reducer when
  they're done to update the state.

#### Example

```javascript
{
  state: {
    users: []
  },
  reducers: {
	receiveUsers: (data, state) => {
    	return { users: data }
    }
  },
  effects: {
    fetchUsers: (data, state, send, done) => {
      http('api.com/users', (err, response, body) => {
        send('receiveUsers', body.users, done)
      })
    }
  }
}
```

---
### Effects

```javascript
// localStorage wrapper
const store = {
  getAll: (storeName, cb) => {
    try {
      cb(JSON.parse(window.localStorage[storeName]))
    } catch (e) {
      cb([])
    }
  },
  add: (storeName, item, cb) => {
    store.getAll(storeName, (items) => {
      items.push(item)
      window.localStorage[storeName] = JSON.stringify(items)
      cb()
    })
  },
  . . . 
```

https://yoshuawuyts.gitbooks.io/choo/content/02_your_first_app.html

---
### Effects

```javascript
app.model({
  state: {
    todos: []
  },
  reducers: {
    receiveTodos: (data, state) => {
      return { todos: data }
    }
    // ...
  },
  effects: {
    getTodos: (data, state, send, done) => {
      store.getAll('todos', (todos) => {
        send('receiveTodos', todos, done)
      })
    }
  }
})
```

???

- We'll use a method from the snippet called `getAll`
- Once it completes, we'll use `send()` to pass the data to a reducer
- Note third param, `done`, which allows effects to be chained together

---
### Effects

```javascript
const view = (state, prev, send) => {
  return html`
    <div onload=${() => send('getTodos')}>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="New item" id="title">
      </form>
      <ul>
        // ...
      </ul>
    </div>`

  function onSubmit (e) {
    // ...
}
```

```javascript
localStorage.todos = '[{"title": "Test", "completed": false}]'
```

???

- Now we'll trigger `getTodos` when our view is rendered

---
### Effects

```javascript
app.model({
  state: {
    todos: []
  },
  reducers: {
    receiveTodos: (data, state) => {...},
    receiveNewTodo: (data, state) => {
      const newTodos = state.todos.slice()
      newTodos.push(data)
      return { todos: newTodos }
    }
  },
  effects: {
    getTodos: (data, state, send, done) => {...},
    addTodo: (data, state, send, done) => {
      const todo = extend(data, {
        completed: false
      })

      store.add('todos', todo, () => {
        send('receiveNewTodo', todo, done)
      })
    }
  }
})
```

???

- We want `addTodo` to interact w/localStorage as well, so we'll
  replace it with an effect and add a reducer to receive its data
- Similar to before: we split functionality and added a side effect

---
### Effects

```javascript
app.model({
  state: {
    todos: []
  },
  reducers: {
    receiveTodos: (data, state) => {...},
    receiveNewTodo: (data, state) => {...},
    replaceTodo: (data, state) => {
      const newTodos = state.todos.slice()
      newTodos[data.index] = data.todo
      return { todos: newTodos }
    }
  },
  effects: {
    getTodos: (data, state, send, done) => {...},
    addTodo: (data, state, send, done) => {...},
    updateTodo: (data, state, send, done) => {
      const oldTodo = state.todos[data.index]
      const newTodo = extend(oldTodo, data.updates)

      store.replace('todos', data.index, newTodo, () => {
        send('replaceTodo', { index: data.index, todo: newTodo }, done)
      })
    }
  }
})
```

???

- Let's do the same for `updateTodo`
- When you call `send` it looks for reducers _and_ effects by that name,
  so our view should already be wired up.
- You should not be able to add items, mark them complete, and refresh

---
### This presentation

timwis.com/choo-workshop

Oh, and we're hiring!

* Data Engineer
* Front-end / WordPress Developer
* Product Manager for beta.phila.gov

Email me: tim.wisniewski@phila.gov
