<p align="center">
<img src="https://i.imgur.com/ki0rbrX.png">
</p>

<p align="center">
<img src="https://img.shields.io/npm/v/vue-firestore.svg">
<img src="https://img.shields.io/npm/l/vue-firestore.svg">
<img src="https://travis-ci.org/gdg-tangier/vue-firestore.svg?branch=master">
</p>

## vue-firestore

Vue.js binding for firebase cloud firestore.

### Installation

Installation via npm : `npm install vue-firestore --save`

### Usage

```javascript
var Vue = require('vue')
var VueFirestore = require('vue-firestore')
var Firebase = require('firebase')

require('firebase/firestore')

Vue.use(VueFirestore)

var firebaseApp = Firebase.initializeApp({ ... })

const firestore = firebaseApp.firestore();

var vm = new Vue({
  el: '#app',
  firestore() {
    return {
        persons: firestore.collection('persons')
    }
  }
})
```

You can get access to firestore properties with `this.$firestore`.

#### Adding Data to collections

```javascript
var vm = new Vue({
  el: '#app',
  firestore: function() {
    return {
        persons: firestore.collection('persons')
    }
  },
  methods:{
    addData: function() {
        this.$firestore.persons.add({
            firstname: "Amrani",
            lastname: "Houssain"
        })
    }
  }
})
```

Each record of the array will contain a `.key` property which specifies the key where the record is stored.

The Result of `persons` collection will be normalized as :

```json
[
    {
        ".key": "-Jtjl482BaXBCI7brMT8",
        "firstname": "Amrani",
        "lastname": "Houssain"
    },
    {
        ".key": "-JtjlAXoQ3VAoNiJcka9",
        "firstname": "John",
        "lastname": "Doe"
    }
]
```

You could delete or update a json document of a collection using the property `.key` of a given object.

```javascript
// Vue methods
deletePerson: function(person) {
    this.$firestore.persons.doc(person['.key']).delete()
},
updatePerson: function(person) {
    this.$firestore.persons.doc(person['.key']).update({
        name: "Amrani Houssain"
        github: "@amranidev"
    })
}
```
