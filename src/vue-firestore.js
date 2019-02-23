import { normalize, ensureRefs, isObject } from './utils/utils'

// Vue binding
let Vue

// Plugin options
let defaultOptions = {
  keyName: '.key',
  enumerable: true
}

/**
 * Define a reactive property to a given Vue instance.
 *
 * @param {Vue} vm
 * @param {string} key
 * @param {*} val
 */
function defineReactive (vm, key, val) {
  if (key in vm) {
    vm[key] = val
  } else {
    Vue.util.defineReactive(vm, key, val)
  }
}

/**
 * Bind firestore collection.
 *
 * @param  {Vu} options.vm
 * @param  {string} options.key
 * @param  {object} options.source
 * @param  {function} options.resolve
 * @param  {function} options.reject
 */
function collections ({ vm, key, source, resolve, reject }) {
  vm.$firestore[key] = source
  let container = []
  defineReactive(vm, key, container)
  source.onSnapshot((doc) => {
    doc.docChanges().forEach(snapshot => {
      switch (snapshot.type) {
        case 'added':
          container.splice(snapshot.newIndex, 0, normalize(snapshot, defaultOptions))
          break
        case 'removed':
          container.splice(snapshot.oldIndex, 1)
          break
        case 'modified':
          if (snapshot.oldIndex !== snapshot.newIndex) {
            container.splice(snapshot.oldIndex, 1)
            container.splice(snapshot.newIndex, 0, normalize(snapshot, defaultOptions))
          } else {
            container.splice(snapshot.newIndex, 1, normalize(snapshot, defaultOptions))
          }
          break
      }
    }, (error) => {
      reject(error)
    })
    resolve(container)
  }, (error) => {
    reject(error)
  })
}

/**
 * Bind as a collection of objects.
 *
 * @param  {Vue} options.vm
 * @param  {string} options.key
 * @param  {object} options.source
 * @param  {function} options.resolve
 * @param  {function} options.reject
 */
function collectionOfObjects ({ vm, key, source, resolve, reject }) {
  vm.$firestore[key] = source
  let container = {}
  defineReactive(vm, key, container)
  source.onSnapshot((doc) => {
    doc.docChanges().forEach(snapshot => {
      switch (snapshot.type) {
        case 'added':
          Vue.set(vm[key], snapshot.doc.id, snapshot.doc.data())
          break
        case 'removed':
          Vue.delete(vm[key], snapshot.doc.id)
          break
        case 'modified':
          Vue.set(vm[key], snapshot.doc.id, snapshot.doc.data())
          break
      }
    }, (error) => {
      reject(error)
    })
    resolve(container)
  }, (error) => {
    reject(error)
  })
}

/**
 * Bind firestore document.
 *
 * @param  {Vue} options.vm
 * @param  {string} options.key
 * @param  {object} options.source
 * @param  {function} options.resolve
 * @param  {function} options.reject
 */
function documents ({ vm, key, source, resolve, reject }) {
  vm.$firestore[key] = source
  let container = []
  defineReactive(vm, key, container)
  source.onSnapshot((doc) => {
    if (doc.exists) {
      container = normalize(doc, defaultOptions)
      vm[key] = container
    } else {
      delete vm.$firestore[key]
      reject(new Error(`This document (${key}) is not exist or permission denied.`))
    }
    resolve(vm[key])
  }, (error) => {
    reject(error)
  })
}

/**
 * Listen for changes, and bind firestore doc source to a key on a Vue instance.
 *
 * @param  {Vue} vm
 * @param  {string} key
 * @param  {object} source
 * @param  {Object} params
 */
function bind (vm, key, source, params = {}) {
  let resolve = null
  let reject = null
  let objects = params.objects ? true : null

  if (isObject(source) && source.hasOwnProperty('ref')) {
    // if the firebase source has (ref) key, we gets the the resolve and reject functions as callbacks
    // and use them when the promise is resolved or rejected.
    resolve = source.resolve ? source.resolve : () => {}
    reject = source.reject ? source.reject : () => {}
    objects = source.objects ? true : null
    source = source.ref
  }

  var binding = new Promise((resolve, reject) => {
    if (objects) {
      collectionOfObjects({ vm, key, source, resolve, reject })
    } else if (source.where) {
      collections({ vm, key, source, resolve, reject })
    } else {
      documents({ vm, key, source, resolve, reject })
    }
  })

  if (resolve || reject) {
    binding.then((res) => resolve(res))
    .catch((err) => reject(err))
  } else {
    return binding
  }
}

/**
 * Initialize.
 */
let init = function () {
  var bindings = this.$options.firestore
  if (typeof bindings === 'function') bindings = bindings.call(this)
  if (!bindings) return
  ensureRefs(this)
  for (var key in bindings) {
    bind(this, key, bindings[key])
  }
}

/**
 * Before Destroy.
 */
let destroy = function () {
  if (!this.$firestore) return
  for (var key in this.$firestore) {
    if (this.$firestore[key]) {
      this.$unbind(key)
    }
  }
  this.$firestore = null
}

/**
 * Vue Mixin
 */
let Mixin = {
  created: init,
  beforeDestroy: destroy
}

/**
 * Install function.
 *
 * @param {Vue} _Vue
 * @param {object} options
 */
let install = function (_Vue, options) {
  Vue = _Vue
  if (options && options.key) defaultOptions.keyName = options.key
  if (options && options.enumerable !== undefined) defaultOptions.enumerable = options.enumerable
  Vue.mixin(Mixin)
  var mergeStrats = Vue.config.optionMergeStrategies
  mergeStrats.fireStore = mergeStrats.methods

    // Manually binding
  Vue.prototype.$binding = function (key, source) {
    if (!this.$firestore) {
      this.$firestore = Object.create(null)
    }

    return bind(this, key, source)
  }

  // Bind Collection As Object
  Vue.prototype.$bindCollectionAsObject = function (key, source) {
    if (!this.$firestore) {
      this.$firestore = Object.create(null)
    }

    return bind(this, key, source, { objects: true })
  }

  Vue.prototype.$unbind = function (key) {
    delete this.$firestore[key]
  }
}

// Install automatically (browser).
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
