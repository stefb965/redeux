var Immutable = require('seamless-immutable')
module.exports = function store(/*things, stuff, ..., initialState*/) {
  if (!arguments.length) {
    throw Error('store requires at least one reducer with the signature: function(action, state) {} and can optionally be passed an initial state object as the last argument')
  }
  var state = Immutable.from({})
  var listeners = []
  var initialState
  var reducers

  if (typeof arguments[arguments.length - 1] === 'object') {
    initialState = Array.prototype.pop.call(arguments)
  }

  reducers = Array.prototype.map.call(
    arguments,
    function(r) {
      var name
      if (!r) { return }
      name = r.name
      if (initialState) {
        if (initialState.hasOwnProperty(name)) {
          state = state.set(name, initialState[name])
        }
        else {
          throw Error('initialState keys do not match reduced state keys.')
        }
      }
      else {
        state = state.set(name, r())
      }
      return r
    }
  )

  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.push(listener)
      return unsubscribe
    }
    else {
      throw TypeError('subscribe requires a listener function with the signature: function(state) {}')
    }
  }

  function unsubscribe(listener) {
    if (typeof listener === 'function') {
      return listeners.splice(listeners.indexOf(listener), 1)
    }
    else {
      throw TypeError('unsubscribe requires a listener function with the signature: function(state) {}')
    }
  }

  function dispatch(action) {
    if (action && typeof action.type === 'string') {
      var name
      var newValue
      var oldValue
      var newState = Immutable.from({})
      reducers.forEach(function(r) {
        name = r.name
        oldValue = state[name]
        newValue = Immutable.from(r(oldValue, action))
        if (oldValue !== newValue) {
          newState = newState.set(name, newValue)
        }
      })

      if (state !== newState) {
        state = state.merge(newState)
        listeners.forEach(function(l) {
          l(state)
        })
      }
    }
    else {
      throw Error('action has the required signature: {type:"string"}')
    }
  }

  function getState() {
    return state
  }

  return {
    subscribe: subscribe,
    dispatch: dispatch,
    getState: getState
  }
}
