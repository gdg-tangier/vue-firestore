import { Vue, firebase, firestore, VueTick, randomString } from './TestCase';

let vm, collection;

describe('vue-firestore', () => {
  beforeEach(async () => {
    collection = firestore.collection('items');
    vm = new Vue({
      data: () => ({
        items: null
      }),
      firestore() {
        return {
          items: collection
        };
      }
    });
    await VueTick();
  });

  test('setup $firestore', () => {
    expect(Object.keys(vm.$firestore).sort()).toEqual(['items']);
    expect(vm.$firestore.items).toBe(collection);
  });

  test('unbind $firestore on $destroy', () => {
    vm.$destroy();
    expect(vm.$firestore).toEqual(null);
  });
});
