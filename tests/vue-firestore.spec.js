import Vue from 'vue'

import VueFirestore from './../dist/vue-firestore'

import Firebase from 'firebase'

var config = {
    apiKey: 'AIzaSyB9Trlbrpo48ilkNHZ6MGbofFf2u8uHuRA',
    authDomain: 'oss-test-myfirebase.firebaseapp.com',
    databaseURL: 'https://oss-test-myfirebase.firebaseio.com',
    projectId: 'oss-test-myfirebase'
}

Vue.use(VueFirestore)

import 'firebase/firestore'

var firebase = Firebase.initializeApp(config)

describe('vue-firestore', function() {
    var fireStore
    beforeEach(function(done) {
        fireStore = firebase.firestore()
        fireStore.settings({ timestampsInSnapshots: true })
        var items = fireStore.collection('items').get()

        //delete items collection before each tests
        items.then(function(snapshot) {
            snapshot.forEach(function(doc) {
                items.doc(doc.id).delete()
            })
        })

        done()
    })

    describe('Check Function options', function() {
        it('Option is callable as function?', function(done) {
            var spy = sinon.spy()
            expect(function() {
                new Vue({
                    firestore: spy
                }).$mount()
            }).to.not.throw()
            expect(spy.calledOnce).to.be.true
            done()
        })
    })
        /*
        describe('Add data to firebase database', function() {
            it('will add data to cloud firestore', function(done) {
                var vm = new Vue({
                    firestore: function() {
                        return {
                            items: fireStore.collection('items')
                        }
                    }
                }).$mount()
                fireStore.collection('items').doc('mybook').set({
                    title: 'MyBook 1',
                    author: 'My Author'
                }).then(function() {
                    expect(vm.items).to.deep.equal([
                        { '.key': 'mybook', title: 'MyBook 1', author: 'My Author' }
                    ])
                }).then(done, done)
            })
        })
        */
})
