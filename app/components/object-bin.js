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
    console.debug("bin objectMoved");
  }.on("objectMoved"),

  actions: {
    handleObjectDropped: function(obj) {
      console.debug("bin handleObjectDropped");
      console.debug("manageList " + this.get('manageList'));
      
      if (this.get('manageList')) {
        console.debug("pushing object");
        this.get("model").pushObject(obj);
      }
      
      // obj.set("title","FIXME");
      // obj.save();
      this.trigger("objectDropped",obj);
    },

    handleObjectDragged: function(obj) {
      console.debug("bin handleObjectDragged");
      if (this.get('manageList')) {
        removeOne(this.get('model'),obj);
      }
      
    }
  }
});