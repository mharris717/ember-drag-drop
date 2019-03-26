import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
import { computed } from '@ember/object';
import ObjHash from './obj-hash';
import { unwrapper } from 'ember-drag-drop/utils/proxy-unproxy-objects';

export default EmberObject.extend(Evented, {
  objectMap: computed(function() {
    return ObjHash.create();
  }),

  getObject: function(id,ops) {
    ops = ops || {};
    var payload = this.get('objectMap').getObj(id);

    if (payload.ops.source) {
      payload.ops.source.sendAction('action',payload.obj);
    }

    if (payload.ops.target) {
      payload.ops.target.sendAction('action',payload.obj);
    }

    this.trigger("objectMoved", {obj: payload.obj, source: payload.ops.source, target: ops.target});

    return unwrapper(payload.obj);
  },

  setObject: function(obj,ops) {
    ops = ops || {};
    return this.get('objectMap').add({obj: obj, ops: ops});
  }
});
