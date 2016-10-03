var assert = require('assert')
var redeux = require('./')

function fail(msg) {
  console.error('  ✘ ' + msg)
}

function pass(msg) {
  console.info('  ✔︎ ' + msg)
}

function test(label, func) {
  var f = false
  console.info(label || '')
  try {
    msg = func()
  }
  catch(e) {
    f = e.message
    fail(f)
  }
  finally {
    if (!f) {
      pass('passed')
    }
  }
}

module.exports = function() {

  test('redeux', function() {
    assert(redeux, 'redeux doesn\'t exist')
  })

  test('should be the combination of many reducers', function() {
    function app() {
      return {}
    }
    function tasks() {
      return []
    }

    assert.deepEqual(
      redeux(tasks, app).getState(),
      {app:{},tasks:[]}
    )
  })

  test('should populate with initial state', function() {
    function app(state, action) {
      return state || {}
    }
    function tasks(state, action) {
      return state || []
    }

    assert.deepEqual(
      redeux(tasks, app, {tasks:[1,2,3],app:{}}).getState(),
      {app:{},tasks:[1,2,3]}
    )
  })

  test('should error when initial state and reduced state do not match', function() {
    function app() {
      return {}
    }
    function tasks() {
      return []
    }
    function things() {
      return {}
    }

    assert.throws(
      function() {
        redeux(
          things,
          tasks,
          app,
          {
            tasks:[1,2,3],
            app:{}
          }
        )
      }
      , Error)
  })

  test('redeux should handle undefined reducers/initial state gracefully', function() {
    assert.ok(redeux(undefined))
  })

  test('redeux.subscribe', function() {
    assert.ok(redeux(function(state, action){}).subscribe, 'subscribe doesn\'t exist')
  })

  test('redeux.dispatch', function() {
    assert(redeux(function(state, action){}).dispatch)
  })

  test('should call reducers', function() {
    function tasks(state, action) {
      if (action === 'YOLO') {
        assert(true, action)
      }
      return [1,2,3]
    }

    var action = {
      type: 'YOLO'
    }

    var store = redeux(tasks)
    store.dispatch(action)
    assert.deepEqual(store.getState(), {tasks:[1,2,3]})
  })

  test('should call listeners', function(){
    function ear(state) {
      assert.deepEqual(state, {tasks:[1,2,3,4]})
    }

    function tasks(state, action) {
      var type = action && action.type || ''
      var data = action && action.data
      if (type === 'ADD') {
        state = state.concat(data)
        return state
      }
      else {
        return [1,2,3]
      }
    }

    var action = {
      type: 'ADD',
      data: 4
    }

    var store = redeux(tasks)
    store.subscribe(ear)
    store.dispatch(action)
    assert.deepEqual(
      {tasks:[1,2,3,4]},
      store.getState()
    )
  })

}()
