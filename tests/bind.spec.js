import { Vue, firebase, firestore, VueTick, randomString } from './TestCase'

let vm, collection, doc
let collectionName = randomString()
let objectCollectionName = randomString()
let documentName = randomString()
describe('Manual binding', () => {
  beforeEach(async () => {
    collection = firestore.collection('items')
    doc = firestore.doc(`collectionOfDocs/doc`)
    vm = new Vue({
      data: () => ({
            //
      }),
      firestore: () => ({
        persons: {
          ref: firestore.collection(objectCollectionName),
          objects: true,
          resolve: async (response) => {
            await response
          },
          reject: async (error) => {
            await error
          }
        }
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
    // Bind Document
    await vm.$binding(documentName, doc)
    expect(vm.$firestore[documentName]).toBe(doc)
    expect(vm[documentName]).toEqual({'.key': 'doc', 'name': 'docName'})

    // Update Document
    await vm.$firestore[documentName].update({name: 'docName2'})
    expect(vm[documentName].name).toEqual('docName2')

    // Just making sure that the next tests not going to be failed XD
    await vm.$firestore[documentName].update({name: 'docName'})
    expect(vm[documentName].name).toEqual('docName')
  })

  test('Binding collection returns promise', async () => {
    expect(vm.$binding('someCollections', collection) instanceof Promise).toBe(true)
  })

  test('Binding document returns promise', async () => {
    expect(vm.$binding('someCollections', doc) instanceof Promise).toBe(true)
  })

  test('Binding collection as object', async () => {
    expect(typeof vm['persons']).toBe('object')
  })

  test('Add/Update/Delete an item to object collection', async () => {
    await vm.$firestore.persons.add({name: 'item'})
    expect(Object.keys(vm['persons']).length).toEqual(1)
    let objectKey = Object.keys(vm['persons'])[0]
    expect(vm['persons'][objectKey].name).toEqual('item')
  })
})
