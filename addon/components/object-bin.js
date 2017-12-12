import Ember from 'ember';

function removeOne(arr,obj) {
  var l = arr.get('length');
  arr.removeObject(obj);
  var l2 = arr.get('length');

  if (l-1 !== l2) {
    throw "bad length " + l + " " + l2;
  }
}

export default Ember.Component.extend( {
  model: Ember.A(),
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
      this.sendAction("objectDropped",{obj: obj, bin: this});
    },

    handleObjectDragged(obj) {
      if (this.get('manageList')) {
        removeOne(this.get('model'),obj);
      }
      this.trigger("objectDraggedInternal",obj);
      this.sendAction("objectDragged");
    }
  }
});
