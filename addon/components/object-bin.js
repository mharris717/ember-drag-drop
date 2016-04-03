import Ember from 'ember';

const {
  A
} = Ember;

var removeOne = function(arr,obj) {
  var l = arr.get('length');
  arr.removeObject(obj);
  var l2 = arr.get('length');

  if (l-1 !== l2) {
    throw "bad length " + l + " " + l2;
  }
};

export default Ember.Component.extend( {
  
  classNames: ['c_object-bin'],

  model: A(),

  manageList: true,

  objectMoved: function() {},

  actions: {
    handleObjectDropped: function(obj) {
      if (this.get('manageList')) {
        this.get("model").pushObject(obj);
      }

      this.trigger("objectDroppedInternal",obj);
      this.sendAction("objectDropped",{obj: obj, bin: this});
    },

    handleObjectDragged: function(obj) {
      if (this.get('manageList')) {
        removeOne(this.get('model'),obj);
      }
      this.trigger("objectDraggedInternal",obj);
      this.sendAction("objectDragged");
    }
  }
});
