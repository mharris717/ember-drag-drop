import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';
import { computed } from '@ember/object';
import ObjHash from './obj-hash';
import { unwrapper } from '../utils/proxy-unproxy-objects';

export default EmberObject.extend(Evented, {
  objectMap: computed(function() {
    return ObjHash.create();
  }),

  getObject: function(id,ops) {
    ops = ops || {};
    var payload = this.get('objectMap').getObj(id);

    if (payload.ops.source && !payload.ops.source.isDestroying && !payload.ops.source.isDestroyed) {
      const action = payload.ops.source['action'];
      // Support when action is a function
      if (typeof action === 'function') {
        action(payload.obj)
      }

      // Support when action is a string
      if (typeof action === 'string' && typeof payload.ops.source.target[action] === 'function') {
        payload.ops.source.target[action](payload.obj);
      }
    }

    if (payload.ops.target && !payload.ops.target.isDestroying && !payload.ops.target.isDestroyed) {
      const action = payload.ops.target['action'];
      // Support when action is a function
      if (typeof action === 'function') {
        action(payload.obj)
      }

      // Support when action is a string
      if (typeof action === 'string' && typeof payload.ops.target.source[action] === 'function') {
        payload.ops.target.source[action](payload.obj);
      }
    }

    this.trigger("objectMoved", {obj: unwrapper(payload.obj), source: payload.ops.source, target: ops.target});

    return unwrapper(payload.obj);
  },

  setObject: function(obj,ops) {
    ops = ops || {};
    return this.get('objectMap').add({obj: obj, ops: ops});
  }
});
