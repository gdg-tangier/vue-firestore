/**
 * Check if a record is an object.
 *
 * @param {*} val
 * @return {boolean}
 */
const isObject = val => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

/**
 * Normalize Firebase snapshot into a bindable data record.
 *
 * @param {FirebaseSnapshot} snapshot
 * @param {object} options
 * @return {object}
 */
const normalize = (snapshot, options) => {
  const value = snapshot.doc ? snapshot.doc.data() : snapshot.data();
  const out = isObject(value) ? value : { '.value': value };
  Object.defineProperty(out, options.keyName, {
    value: snapshot.doc ? snapshot.doc.id : snapshot.id,
    enumerable: options.enumerable
  });
  return out;
};

/**
 * Ensure firebasestore option on a vue instance.
 *
 * @param {Vue} vm
 */
const ensureRefs = vm => {
  if (!vm.$firestore) {
    vm.$firestore = Object.create(null);
  }
};

export { isObject, normalize, ensureRefs };
