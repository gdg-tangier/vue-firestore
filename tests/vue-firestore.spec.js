import Vue from "vue"

import VueFirestore from "./../dist/vue-firestore"

Vue.use(VueFirestore)

describe('vue-firestore', function() {
    var fireStore
    beforeEach(function(done) {

        done()
    })

    describe('Check Function options', function() {
        it('Option is callable as function?', function() {
            var spy = sinon.spy()
            expect(function() {
                new Vue({
                    firestore: spy
                }).$mount()
            }).to.not.throw()
            expect(spy.calledOnce).to.be.true
        })
    })
})