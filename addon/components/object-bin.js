import Ember from 'ember';

var YieldLocalMixin = Ember.Mixin.create({
  _yield: function(context, options) {
    var view = options.data.view;
    var parentView = this._parentView;
    var template = Ember.get(this, 'template');

    if (template) {
      Ember.assert("A Component must have a parent view in order to yield.", parentView);

      view.appendChild(Ember.View, {
        isVirtual: true,
        tagName: '',
        _contextView: parentView,
        template: template,
        context: Ember.get(view, 'context'),
        controller: Ember.get(view, 'controller'),
        templateData: { keywords: {} }
      });
    }
  }
});

var removeOne = function(arr,obj) {
  var l = arr.get('length');
  arr.removeObject(obj);
  var l2 = arr.get('length');

  if (l-1 !== l2) {
    throw "bad length " + l + " " + l2;
  }
};

export default Ember.Component.extend(YieldLocalMixin, {
  model: [],
  classNames: ['draggable-object-bin'],

  manageList: true,

  handleObjectMoved: function() {
  }.on("objectMoved"),

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
