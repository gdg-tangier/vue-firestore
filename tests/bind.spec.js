import { Vue, firebase, firestore, VueTick, randomString } from './TestCase'

let vm, collection, doc
let collectionName = randomString()
let documentName = randomString()
describe('Manual binding', () => {
  beforeEach(async () => {
    collection = firestore.collection('items')
    doc = firestore.doc('collectionOfDocs/doc')
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

  test('Bind document manually', async () => {
    await vm.$binding(documentName, doc)
    expect(vm.$firestore[documentName]).toBe(doc)
    expect(vm[documentName]).toEqual({'.key': 'doc', 'name': 'docName'})
  })

  test('Binding collection returns promise', async () => {
    expect(vm.$binding('someCollections', collection) instanceof Promise).toBe(true)
  })

  test('Binding document returns promise', async () => {
    expect(vm.$binding('someCollections', doc) instanceof Promise).toBe(true)
  })
})
