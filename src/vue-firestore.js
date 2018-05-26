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
function collections({ vm, key, source, resolve, reject }) {
    vm.$firestore[key] = source
    let container = []
    defineReactive(vm, key, container);
    source.onSnapshot((doc) => {
        doc.docChanges().forEach(snapshot => {
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
        }, (error) => {
            reject(error)
        })
        resolve(container)
    }, (error) => {
        reject(error)
    })
}

/**
 * Bind firestore doc source to a key on a Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {object} source 
 */
function documents({ vm, key, source, resolve, reject }) {
    vm.$firestore[key] = source
    let container = []
    defineReactive(vm, key, container);
    source.onSnapshot((doc) => {
        if (doc.exists) {
            container = normalize(doc)
            vm[key] = container
        } else {
            delete vm.$firestore[key]
            reject("Doc is not exist or permission denied")
        }
        resolve(vm[key])
    }, (error) => {
        reject(error)
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
    return new Promise((resolve, reject) => {
        if (source.where) {
            collections({ vm, key, source, resolve, reject })
        } else {
            documents({ vm, key, source, resolve, reject })
        }
    })
}

// Initialize.
let init = function () {
    var bindings = this.$options.firestore
    if (typeof bindings === 'function') bindings = bindings.call(this)
    if (!bindings) return
    ensureRefs(this)
    for (var key in bindings) {
        bind(this, key, bindings[key])
    }
}

// Before Destroy.
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
 */
let install = function (_Vue) {
    Vue = _Vue
    Vue.mixin(Mixin)
    var mergeStrats = Vue.config.optionMergeStrategies
    mergeStrats.fireStore = mergeStrats.methods

    // Manually binding
    Vue.prototype.$binding = function (key, source) {
        ensureRefs(this)
        return bind(this, key, source)
    }
}

// Install automatically (browser).
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}


export default install
