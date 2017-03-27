module.exports = function store () {
  var state = {}
  var listeners = []
  var initialState
  var reducers

  if (typeof arguments[arguments.length - 1] === 'object') {
    initialState = Array.prototype.pop.call(arguments)
  }

  reducers = Array.prototype.map.call(
    arguments,
    function (r) {
      if (!r) {
        return
      }
      if (initialState) {
        if (!initialState.hasOwnProperty(r.name)) {
          console.warn('initialState.' + r.name + ' is missing.')
        }
        state[r.name] = r(initialState[r.name])
      } else {
        state[r.name] = r()
      }
      return r
    }
  )

  function subscribe (listener) {
    listeners.push(listener)
    return unsubscribe
  }

  function unsubscribe (listener) {
    return listeners.splice(listeners.indexOf(listener), 1)
  }

  function dispatch (action) {
    if (action && typeof action.type !== 'string') {
      console.error('action.type must be a "string"')
    }
    var currentState = getState()
    var name
    var keys
    var tempState
    reducers.forEach(function (r) {
      name = r.name
      state[name] = r(currentState[name], action)
      listeners.forEach(function (l) {
        if (l.keys && l.keys.length) {
          keys = l.keys
          keys.forEach(function (k) {
            if (name === k) {
              tempState = {}
              tempState[name] = state[name]
              l(tempState)
            }
          })
        } else {
          l(state)
        }
      })
    })
  }

  function getState () {
    return Object.assign({}, state)
  }

  return {
    subscribe: subscribe,
    dispatch: dispatch,
    getState: getState
  }
}
