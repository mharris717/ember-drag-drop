import Ember from 'ember';
import ObjHash from './obj-hash';

export default Ember.Object.extend(Ember.Evented, {
  objectMap: Ember.computed(function() {
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

    return payload.obj;
  },

  setObject: function(obj,ops) {
    ops = ops || {};
    return this.get('objectMap').add({obj: obj, ops: ops});
  }
});