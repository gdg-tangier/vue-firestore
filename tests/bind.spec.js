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
    // Bind Collection
    await vm.$binding(collectionName, firestore.collection(collectionName))
    expect(vm[collectionName]).toEqual([])
    
    // Add To Collection
    await vm.$firestore[collectionName].add({name: 'item'})
    expect(vm[collectionName].length).toEqual(1)
    expect(vm[collectionName][0].name).toEqual('item')

    // Update Collection Item
    let updatedItem = vm[collectionName][0]
    await vm.$firestore[collectionName].doc(updatedItem['.key']).update({name: 'item2'})
    expect(vm[collectionName].length).toEqual(1)
    expect(vm[collectionName][0].name).toEqual('item2')

    // Delete Collection item
    let deletedItem = vm[collectionName][0]
    await vm.$firestore[collectionName].doc(deletedItem['.key']).delete()
    expect(vm[collectionName].length).toEqual(0)
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
