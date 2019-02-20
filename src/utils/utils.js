/**
 * Check if a record is an object.
 *
 * @param {*} val
 * @return {boolean}
 */
export function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * Normalize Firebase snapshot into a bindable data record.
 *
 * @param {FirebaseSnapshot} snapshot
 * @param {string} keyName
 * @param {boolean} enumerable
 * @return {object}
 */
export function normalize (snapshot, keyName = '.key', enumerable = false) {
  var value = snapshot.doc ? snapshot.doc.data() : snapshot.data()
  var out = isObject(value) ? value : { '.value': value }
  Object.defineProperty(out, keyName, {
    value: snapshot.doc ? snapshot.doc.id : snapshot.id,
    enumerable: enumerable
  })
  return out
}

/**
 * Ensure firebasestore option on a vue instance.
 *
 * @param {Vue} vm
 */
export function ensureRefs (vm) {
  if (!vm.$firestore) {
    vm.$firestore = Object.create(null)
  }
}
