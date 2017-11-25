import { isObject, normalize, ensureRefs } from './utils/utils'

// Vue binding
let Vue

/**
 * Define a reactive property to a given Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {*} val 
 */
function defineReactive(vm, key, val) {
    if (key in vm) {
        vm[key] = val
    } else {
        Vue.util.defineReactive(vm, key, val)
    }
}

/**
 * Bind firestore collection source to a key on a Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {object} source 
 */
function collections(vm, key, source) {
    vm.$firestore[key] = source
    let container = []
    defineReactive(vm, key, container);
    source.onSnapshot((doc) => {
        doc.docChanges.forEach(snapshot => {
            switch (snapshot.type) {
                case "added":
                    container.splice(snapshot.newIndex, 0, normalize(snapshot))
                    break;
                case "removed":
                    container.splice(snapshot.oldIndex, 1)
                    break;
                case "modified":
                    if (snapshot.oldIndex !== snapshot.newIndex) {
                        container.splice(snapshot.oldIndex, 1);
                        container.splice(snapshot.newIndex, 0, normalize(snapshot));
                    } else {
                        container.splice(snapshot.newIndex, 1, normalize(snapshot));
                    }
                    break;
            }
        })
    })
}

/**
 * Bind firestore doc source to a key on a Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {object} source 
 */
function documents(vm, key, source) {
    vm.$firestore[key] = source
    vm[key] = null
    source.onSnapshot((doc) => {
        if (doc.exists) {
            let container = normalize(doc)
            vm[key] = container
        }
    })
}

/**
 * Listen for changes, and bind firestore doc source to a key on a Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {object} source 
 */
function bind(vm, key, source) {
    if (source.where) {
        collections(vm, key, source)
    } else {
        documents(vm, key, source)
    }
}

let init = function() {
    var bindings = this.$options.firestore
    if (typeof bindings === 'function') bindings = bindings.call(this)
    if (!bindings) return
    ensureRefs(this)
    for (var key in bindings) {
        bind(this, key, bindings[key])
    }
}

/**
 * Vue Mixin
 */
let Mixin = {
    created: init
}

/**
 * Install function.
 * 
 * @param {Vue} _Vue 
 */
let install = function(_Vue) {
    Vue = _Vue
    Vue.mixin(Mixin)
    var mergeStrats = Vue.config.optionMergeStrategies
    mergeStrats.fireStore = mergeStrats.methods

    // Manually binding
    Vue.prototype.$binding = function(key, source) {
        ensureRefs(this)
        bind(this, key, source)
    }
}

export default install