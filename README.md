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

### Try it out: [Demo](https://tinyurl.com/yawseaer)

### Installation

#### Globally (Browser)

vue-firestore will be installed automatically.

```html
<!-- Vue -->   
<script src="https://unpkg.com/vue"></script>
<!-- Firebase -->   
<script src="https://www.gstatic.com/firebasejs/4.8.1/firebase.js"></script>
<!-- Firestore -->   
<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-firestore.js"></script>
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
  firestore() {
    return {
        // Collection
        persons: firestore.collection('persons'),
        // Doc
        ford: firestore.collection('cars').doc('ford')
    }
  }
})
```

2. Manually binding

You can bind your docs/collection manually using `this.$binding`, and wait for data to be resolved, this case is really useful when we want to wait for data to be rendered and do some specific actions.

```javascript
...
mounted() {
  // Binding Collections
  this.$binding("users", firebase.firestore().collection("users"))
  .then((users) => {
    console.log(users) // => __ob__: Observer
  })
  
  // Binding Docs
  this.$binding("Ford", firebase.firestore().collection("cars").doc("ford"))
  .then((ford) => {
    console.log(ford) // => __ob__: Observer
  }).catch(err => {
    console.error(err)
  })
}
...
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

## More Resources
- [Quick Start on Alligator.io](https://alligator.io/vuejs/vue-cloud-firestore/)

## LICENSE
[MIT](https://opensource.org/licenses/MIT)
