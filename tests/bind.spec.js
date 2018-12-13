import { Vue, firebase, firestore, VueTick, randomString } from './TestCase'

let vm, collection
let collectionName = randomString()

describe('vue-firestore', () => {
    beforeEach( async () => {
      collection = firestore.collection('items')
      vm = new Vue({
        data: () => ({
            //
        })
      })
      await VueTick()
    })

    test('Bind collection manually', async () => {
      await vm.$binding(collectionName, firestore.collection(collectionName))
      expect(vm[collectionName]).toEqual([])
      await vm.$firestore[collectionName].add({name: 'item'})
      expect(vm[collectionName].length).toEqual(1)
      expect(vm[collectionName][0].name).toEqual('item')
    })
})
