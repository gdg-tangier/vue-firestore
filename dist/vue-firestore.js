(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Vue-firestore"] = factory();
	else
		root["Vue-firestore"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = __webpack_require__(2);

// Vue binding
var Vue = void 0;

/**
 * Define a reactive property to a given Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {*} val 
 */
function defineReactive(vm, key, val) {
    if (key in vm) {
        vm[key] = val;
    } else {
        Vue.util.defineReactive(vm, key, val);
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
    vm.$firestore[key] = source;
    var container = [];
    defineReactive(vm, key, container);
    source.onSnapshot(function (doc) {
        doc.docChanges.forEach(function (snapshot) {
            switch (snapshot.type) {
                case "added":
                    container.splice(snapshot.newIndex, 0, (0, _utils.normalize)(snapshot));
                    break;
                case "removed":
                    container.splice(snapshot.oldIndex, 1);
                    break;
                case "modified":
                    if (snapshot.oldIndex !== snapshot.newIndex) {
                        container.splice(snapshot.oldIndex, 1);
                        container.splice(snapshot.newIndex, 0, (0, _utils.normalize)(snapshot));
                    } else {
                        container.splice(snapshot.newIndex, 1, (0, _utils.normalize)(snapshot));
                    }
                    break;
            }
        });
    });
}

/**
 * Bind firestore doc source to a key on a Vue instance.
 * 
 * @param {Vue} vm 
 * @param {string} key 
 * @param {object} source 
 */
function documents(vm, key, source) {
    vm.$firestore[key] = source;
    var container = [];
    defineReactive(vm, key, container);
    source.onSnapshot(function (doc) {
        if (doc.exists) {
            container = (0, _utils.normalize)(doc);
        }
    });
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
        collections(vm, key, source);
    } else {
        documents(vm, key, source);
    }
}

var init = function init() {
    var bindings = this.$options.firestore;
    if (typeof bindings === 'function') bindings = bindings.call(this);
    if (!bindings) return;
    (0, _utils.ensureRefs)(this);
    for (var key in bindings) {
        bind(this, key, bindings[key]);
    }
};

/**
 * Vue Mixin
 */
var Mixin = {
    created: init

    /**
     * Install function.
     * 
     * @param {Vue} _Vue 
     */
};var install = function install(_Vue) {
    Vue = _Vue;
    Vue.mixin(Mixin);
    var mergeStrats = Vue.config.optionMergeStrategies;
    mergeStrats.fireStore = mergeStrats.methods;

    // Manually binding
    Vue.prototype.$binding = function (key, source) {
        (0, _utils.ensureRefs)(this);
        bind(this, key, source);
    };
};

exports.default = install;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueFirestore = __webpack_require__(0);

var _vueFirestore2 = _interopRequireDefault(_vueFirestore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _vueFirestore2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isObject = isObject;
exports.normalize = normalize;
exports.ensureRefs = ensureRefs;
/**
 * Check if a record is an object.
 * 
 * @param {*} val 
 * @return {boolean}
 */
function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

/**
 * Normalize Firebase snapshot into a bindable data record.
 * 
 * @param {FirebaseSnapshot} snapshot
 * @return {object}
 */
function normalize(snapshot) {
    var value = snapshot.doc ? snapshot.doc.data() : snapshot.data();
    var out = isObject(value) ? value : { '.value': value };
    out['.key'] = snapshot.doc ? snapshot.doc.id : snapshot.id;
    return out;
}

/**
 * Ensure firebasestore option on a vue instance.
 * 
 * @param {Vue} vm 
 */
function ensureRefs(vm) {
    if (!vm.$firestore) {
        vm.$firestore = Object.create(null);
    }
}

/***/ })
/******/ ]);
});