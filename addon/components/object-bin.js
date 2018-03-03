import Component from '@ember/component';
import { A } from '@ember/array';

function removeOne(arr,obj) {
  var l = arr.get('length');
  arr.removeObject(obj);
  var l2 = arr.get('length');

  if (l-1 !== l2) {
    throw "bad length " + l + " " + l2;
  }
}

export default Component.extend( {
  model: A(),
  classNames: ['draggable-object-bin'],

  manageList: true,

  objectMoved() {
  },

  actions: {
    handleObjectDropped(obj) {
      if (this.get('manageList')) {
        this.get("model").pushObject(obj);
      }

      this.trigger("objectDroppedInternal",obj);
      this.get('objectDropped')({obj: obj, bin: this});
    },

    handleObjectDragged(obj) {
      if (this.get('manageList')) {
        removeOne(this.get('model'),obj);
      }
      this.trigger("objectDraggedInternal",obj);
      this.get('objectDragged')();
    }
  }
});
