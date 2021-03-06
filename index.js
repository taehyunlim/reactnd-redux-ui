// Generate a id
function generateId () {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// Library Code
// (Replaced with Redux library)

// App Code
const ADD_TODO = 'ADD_TODO',
  REMOVE_TODO = 'REMOVE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  ADD_GOAL = 'ADD_GOAL',
  REMOVE_GOAL = 'REMOVE_GOAL',
  RECEIVE_DATA = 'RECEIVE_DATA'

// ACTION CREATORS
function addToDoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeToDoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleToDoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}

function mealCreator(id) {
  return {
    type: 'CREATE_MEAL',
    id,
  }
}

// New set of actions
function receiveDataAction (todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  }
}

// New action code to handle async API calls
function handleDeleteTodo(todo) {
  return (dispatch) => {
    // Optimistically delete todo and restore when faile
    dispatch(removeToDoAction(todo.id))
    return API.deleteTodo(todo.id)
      .catch(() => {
        dispatch(addToDoAction(todo))
        alert('An error occurred. Try again.')
      })
  }
}

function handleAddGoal (name, cb) {
  return (dispatch) => {
    return API.saveGoal(name)
      .then((goal) => {
        dispatch(addGoalAction(goal))
        cb()
      })
      .catch(() => alert('An error occurred. Try again.'))
  }
}

function handleDeleteGoal (goal) {
  return (dispatch) => {
    // Optimistically delete goal and restore when failed
    dispatch(removeGoalAction(goal.id))

    return API.deleteGoal(goal.id)
    .catch(() => {
      dispatch(addGoalAction(goal))
      alert('An error occurred. Try again.')
    })
  }
}

function handleAddTodo (name, cb) {
  return (dispatch) => {
    return API.saveTodo(name)
      .then((todo) => {
        dispatch(addToDoAction(todo))
        cb()
      })
      .catch(() => alert('An error occurred. Try again.'))
  }
}

function handleToggleTodo (id) {
  return (dispatch) => {
    // Optimistically toggle todo and restore when failed
    dispatch(toggleToDoAction(id))

    return API.saveTodoToggle(id)
      .catch(() => {
        dispatch(toggleToDoAction(id))
        alert('An error occurred. Try again.')
      }) 
  }
}

function handleInitialData () {
  return (dispatch) => {
    return Promise.all([
      API.fetchTodos(),
      API.fetchGoals()
    ]).then(([todos, goals]) => {
      dispatch(receiveDataAction(todos, goals))
    })
  }
}

function todos (state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map((todo) => todo.id !== action.id ? todo : Object.assign({}, todo, { complete : !todo.complete }))
    case RECEIVE_DATA:
      return action.todos
    default:
      return state
  }
}

function goals (state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    case RECEIVE_DATA:
      return action.goals
    default:
      return state
  }
}

function loading (state = true, action) {
  switch(action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}

// Comebine _reducer_ functions
// function app (state = {}, action) {
//   return {
//     todos: todos(state.todos, action),
//     goals: goals(state.goals, action)
//   }
// }

// First middleware: checks and validate input
const checker = store => next => action => {
  if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes('bitcoin')) {
    return alert("Bad idea.")
  } 
  if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('bitcoin')) {
    return alert("Bad idea.")
  }
  return next(action)
}

// Second middleware: logger
const logger = (store) => (next) => (action) => {
  console.group(action.type)
    console.log('The action: ', action)
    const result = next(action)
    console.log('The new state: ', store.getState())
  console.groupEnd()
  return result
}

// // Custom Thunk
// const thunk = (store) => (next) => (action) => {
//   if (typeof action === 'function') {
//     return action(store.dispatch)
//   }
//   return next(action)
// }

// Just 'cause
const commentAlert = (store) => (next) => (action) => {
  if (action.type === ADD_GOAL && action.goal.name !== '') {
    alert("That's a great goal!")
  } else if (action.type === ADD_TODO && action.todo.name !== '') {
    alert(`Don't forget to ${action.todo.name}!`)
  }
  return next(action)
}

const store = Redux.createStore(Redux.combineReducers({
  todos: todos,
  goals: goals,
  loading: loading
  // Invoke checker function as the second argument to createStore, after applying middleware which allows the function to intercept a dispatched action before it reaches the reducer inside the store
  // Redux.applyMiddleware(...middlewares)
  }), Redux.applyMiddleware(
    ReduxThunk.default,
    checker, 
    logger,
    // commentAlert
  ))
 
// store.subscribe(() => {
//   console.log(`The new state is: `, store.getState())

//   // Clear DOM
//   document.getElementById('goals').innerHTML = ''
//   document.getElementById('to-dos').innerHTML = ''

//   // Invoke DOM methods to append each of the state elements to DOM 
//   const { goals, todos } = store.getState()
//   goals.forEach(addGoalToDOM)
//   todos.forEach(addToDoToDOM)
// })

// // const unsubscribe = store.subscribe(() => {
// //   console.log('The store changed.')
// // })

// // unsubscribe()

// // DOM Code
// function addToDo () {
//   const input = document.getElementById('to-do')
//   const name = input.value
//   input.value = ''

//   store.dispatch(addToDoAction({
//     name,
//     complete: false,
//     id: generateId()
//   }))
// }

// function addGoal () {
//   const input = document.getElementById('goal')
//   const name = input.value
//   input.value = ''

//   store.dispatch(addGoalAction({
//     name,
//     id: generateId()
//   }))
// }

// document.getElementById('toDoBtn')
//   .addEventListener('click', addToDo);

// document.getElementById('goalBtn')
//   .addEventListener('click', addGoal);

// // Declare a function whose callback function is hooked to a DOM event listener
// function createRemoveButton (callback) {
//   const removeBtn = document.createElement('button')
//   removeBtn.innerHTML = 'X'
//   removeBtn.addEventListener('click', callback)
//   return removeBtn
// }

// function addToDoToDOM (todo) {
//   const node = document.createElement('li')
//   const text = document.createTextNode(todo.name)

//   const removeBtn = createRemoveButton(() => {
//     // The callback function that is hooked to createRemoveButton
//     // Invoke dispatch method
//     store.dispatch(removeToDoAction(todo.id))
//   })

//   node.appendChild(text)
//   node.appendChild(removeBtn)

//   // Toggle complete boolean
//   node.style.textDecoration = todo.complete ? 'line-through' : 'none'
//   node.addEventListener('click', () => {
//     store.dispatch(toggleToDoAction(todo.id))
//   })

//   document.getElementById('to-dos')
//     .appendChild(node)

// }

// function addGoalToDOM (goal) {
//   const node = document.createElement('li')
//   const text = document.createTextNode(goal.name)

//   // Purposely did not use _createRemoveButton_ method delcared above to demonstrate the callback invocation parameter in _addEventListener_ method
//   const removeBtn = document.createElement('button')
//   removeBtn.innerHTML = 'X'
//   removeBtn.addEventListener('click', () => {
//     // Invoke dispatch method
//     store.dispatch(removeGoalAction(goal.id))
//   })

//   node.appendChild(text)
//   node.appendChild(removeBtn)

//   document.getElementById('goals')
//     .appendChild(node)
// }