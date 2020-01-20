<p align="center">
<img src="https://i.imgur.com/ki0rbrX.png">
</p>

<p align="center">
<img src="https://img.shields.io/npm/v/vue-firestore.svg">
<img src="https://img.shields.io/npm/l/vue-firestore.svg">
<img src="https://img.shields.io/npm/dt/vue-firestore.svg">
<img src="https://travis-ci.org/gdg-tangier/vue-firestore.svg?branch=master">
</p>

## vue-firestore

Vue.js binding for firebase cloud firestore.

### Prerequisites

Firebase `^7.6.1`

### Try it out: [Demo](http://jsbin.com/noviduy/7/edit?html,js,output)

### Installation

#### Globally (Browser)

vue-firestore will be installed automatically.

```html
<!-- Vue -->   
<script src="https://unpkg.com/vue"></script>
<!-- Firebase -->   
<script src="https://www.gstatic.com/firebasejs/5.3.1/firebase.js"></script>
<!-- Firestore -->   
<script src="https://www.gstatic.com/firebasejs/5.3.1/firebase-firestore.js"></script>
<!-- vue-firestore -->   
<script src="https://unpkg.com/vue-firestore"></script>

<script>        
  // Firebase config.
  var config = {
        apiKey: "your-apik-ey",
        authDomain: "your-auth-domain",
        databaseURL: "your-database-url",
        projectId: "your-project-id",
        storageBucket: "your-storage-bucket",
        messagingSenderId: "your-messaing-sender-id"
      }

  // Initialize Firebase.
  firebase.initializeApp(config);
</script>
```

#### npm

Installation via npm : `npm install vue-firestore --save`

### Usage

vue-firestore supports binding for the both (collections/docs) in realtime, you can bind your properties in two ways using `firestore` option or bind them manually with `$binding`.

1. using `firestore` option.

```javascript

import Vue from 'vue'
import VueFirestore from 'vue-firestore'
import Firebase from 'firebase'

require('firebase/firestore')

Vue.use(VueFirestore)

var firebaseApp = Firebase.initializeApp({ ... })

const firestore = firebaseApp.firestore();

var vm = new Vue({
  el: '#app',
  firestore () {
    return {
        // Collection
        persons: firestore.collection('persons'),
        // Doc
        ford: firestore.collection('cars').doc('ford')
    }
  }
})
```

You can pass an object to the `firestore()` function.

As you may know, firestore source returns a promise, so you can handle it if it's resolved by `resolve` function
or rejected by `reject` function, this case is really useful when we want to wait for data to be rendered and do some specific actions.

```javascript
firestore () {
  return {
    persons: {
      // collection reference.
      ref: firestore.collection('persons'),
      // Bind the collection as an object if you would like to.
      objects: true,
      resolve: (data) => {
          // collection is resolved
      },
      reject: (err) => {
          // collection is rejected
      }
    }
  }
}

```

2. Manually binding

You can bind your docs/collection manually using `this.$binding`, and wait for data to be resolved, this case is really useful when we want to wait for data to be rendered and do some specific actions.

```javascript
...
mounted () {
  // Binding Collections
  this.$binding("users", firestore.collection("users"))
  .then((users) => {
    console.log(users) // => __ob__: Observer
  })

  // Binding Docs
  this.$binding("Ford", firestore.collection("cars").doc("ford"))
  .then((ford) => {
    console.log(ford) // => __ob__: Observer
  }).catch(err => {
    console.error(err)
  })
}
...
```

Vue firestore latest release supports binding collections as objects, you can bind the collection manually by `this.$bindCollectionAsObject(key, source)` or you can explicitly do that by adding `{objects: true}` to `firestore()` function, see the previous example above.

The normalized resutls of `$bindCollectionAsObject`:

```javascript
{
    tjlAXoQ3VAoNiJcka9: {
        firstname: "Jhon",
        lastname: "Doe"
    },
    fb7AcoG3QAoCiJcKa9: {
        firstname: "Houssain",
        lastname: "Amrani"
    }
}
```


You can get access to firestore properties with `this.$firestore`.

#### Adding Data to collections

```javascript
var vm = new Vue({
  el: '#app',
  firestore: function () {
    return {
        persons: firestore.collection('persons')
    }
  },
  methods:{
    addData: function () {
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
deletePerson: function (person) {
    this.$firestore.persons.doc(person['.key']).delete()
},
updatePerson: function (person) {
    this.$firestore.persons.doc(person['.key']).update({
        name: "Amrani Houssain"
        github: "@amranidev"
    })
}
```

You can customize the name of the `.key` property by passing an option when initializing vue-firestore:

```javascript
require('firebase/firestore')

Vue.use(VueFirestore, {
    key: 'id',         // the name of the property. Default is '.key'.
    enumerable: true  //  whether it is enumerable or not. Default is true.
})
```

This would allow you to do `person.id` instead of `person['.key']`.



## More Resources
- [Quick Start on Alligator.io](https://alligator.io/vuejs/vue-cloud-firestore/)

## LICENSE
[MIT](https://opensource.org/licenses/MIT)
