import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
import { computed } from '@ember/object';
import ObjHash from './obj-hash';

export default EmberObject.extend(Evented, {
  objectMap: computed(function() {
    return ObjHash.create();
  }),

  getObject: function(id,ops) {
    ops = ops || {};
    var payload = this.get('objectMap').getObj(id);

    this.trigger("objectMoved", {obj: payload.obj, source: payload.ops.source, target: ops.target});

    return payload.obj;
  },

  setObject: function(obj,ops) {
    ops = ops || {};
    return this.get('objectMap').add({obj: obj, ops: ops});
  }
});
