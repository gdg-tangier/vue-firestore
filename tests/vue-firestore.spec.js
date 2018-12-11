import Vue from 'vue'

import VueFirestore from './../dist/vue-firestore'

import Firebase from 'firebase'

var config = {
    apiKey: "AIzaSyB9Trlbrpo48ilkNHZ6MGbofFf2u8uHuRA",
    authDomain: "oss-test-myfirebase.firebaseapp.com",
    databaseURL: "https://oss-test-myfirebase.firebaseio.com",
    projectId: "oss-test-myfirebase",
    storageBucket: "oss-test-myfirebase.appspot.com",
    messagingSenderId: "10529373536"
}

Vue.use(VueFirestore)

import 'firebase/firestore'

var firebase = Firebase.initializeApp(config)
var firestore = firebase.firestore()

firestore.settings({timestampsInSnapshots: true})

function VueTick() {
  return new Promise((resolve, reject) => {
    Vue.nextTick(resolve)
  })
}

let vm, collection
describe('vue-firestore', () => {
    beforeEach( async (done) => {
      collection = firestore.collection('items')
      // var doc = collection.doc()
      vm = new Vue({
        data: () => ({
          items: null,
          item: null
        }),
        firestore () {
          return {
            items: collection,
            // item: doc
          }
        }
      })
      await VueTick()
      done()
    })

    test('setups $firestore', () => {
      expect(Object.keys(vm.$firestore).sort()).toEqual(['items'])
      expect(vm.$firestore.items).toBe(collection)
    })
})
