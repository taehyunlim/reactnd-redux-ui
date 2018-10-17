// Generate a id
function generateId () {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// Library Code
function createStore (reducer) {
  // The store should have four parts
  // 1. The state
  // 2. Get the state
  // 3. Listen to the changes on the state
  // 4. Update the state

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

// App Code
const ADD_TODO = 'ADD_TODO',
  REMOVE_TODO = 'REMOVE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  ADD_GOAL = 'ADD_GOAL',
  REMOVE_GOAL = 'REMOVE_GOAL'

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

function toDos (state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO:
      return state.map((todo) => todo.id !== action.id ? todo : Object.assign({}, todo, { complete : !todo.complete }))
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
    default:
      return state
  }
}

function app (state = {}, action) {
  return {
    todos: toDos(state.todos, action),
    goals: goals(state.goals, action)
  }
}


const store = createStore(app)
 
store.subscribe(() => {
  console.log(`The new state is: `, store.getState())

  // Clear DOM
  document.getElementById('goals').innerHTML = ''
  document.getElementById('to-dos').innerHTML = ''

  // Invoke DOM methods to append each of the state elements to DOM 
  const { goals, todos } = store.getState()
  goals.forEach(addGoalToDOM)
  todos.forEach(addToDoToDOM)
})

// const unsubscribe = store.subscribe(() => {
//   console.log('The store changed.')
// })

// unsubscribe()


// //  ACTIONS - DISPATCH INVOCATIONS
// store.dispatch(addTodoAction({
//   id: 0,
//   name: 'Walk the dog',
//   complete: false,
//   }))

// store.dispatch(addTodoAction({
//   id: 1,
//   name: 'Wash the car',
//   complete: false,
// }))

// store.dispatch({
//   type: ADD_GOAL,
//   goal: {
//     id: 3,
//     name: 'TEST',
//     complete: true,
//   }
// })

// store.dispatch(addTodoAction({
//   id: 2,
//   name: 'Go to the gym',
//   complete: true,
// }))

// store.dispatch(removeTodoAction(1))

// store.dispatch(toggleTodoAction(0))

// store.dispatch(addGoalAction({
//   id: 0,
//   name: 'Learn Redux'
// }))

// store.dispatch(addGoalAction({
//   id: 1,
//   name: 'Lose 20 pounds'
// }))

// store.dispatch(removeGoalAction(0))


// DOM Code
function addToDo () {
  const input = document.getElementById('to-do')
  const name = input.value
  input.value = ''

  store.dispatch(addToDoAction({
    name,
    complete: false,
    id: generateId()
  }))
}

function addGoal () {
  const input = document.getElementById('goal')
  const name = input.value
  input.value = ''

  store.dispatch(addGoalAction({
    name,
    id: generateId()
  }))
}

document.getElementById('toDoBtn')
  .addEventListener('click', addToDo);

document.getElementById('goalBtn')
  .addEventListener('click', addGoal);

// Declare a function whose callback function is hooked to a DOM event listener
function createRemoveButton (callback) {
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'X'
  removeBtn.addEventListener('click', callback)
  return removeBtn
}

function addToDoToDOM (todo) {
  const node = document.createElement('li')
  const text = document.createTextNode(todo.name)

  const removeBtn = createRemoveButton(() => {
    // The callback function that is hooked to createRemoveButton
    // Invoke dispatch method
    store.dispatch(removeToDoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  // Toggle complete boolean
  node.style.textDecoration = todo.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(toggleToDoAction(todo.id))
  })

  document.getElementById('to-dos')
    .appendChild(node)

}

function addGoalToDOM (goal) {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.name)

  // Purposely did not use _createRemoveButton_ method delcared above to demonstrate the callback invocation parameter in _addEventListener_ method
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'X'
  removeBtn.addEventListener('click', () => {
    // Invoke dispatch method
    store.dispatch(removeGoalAction(goal.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('goals')
    .appendChild(node)
}