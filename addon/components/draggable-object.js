import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ["draggable-object"],
  classNameBindings: ["isDraggingObject:is-dragging-object:"],
  attributeBindings: ['draggable'],
  isDraggable: true,

  draggable: function() {
    var isDraggable = this.get('isDraggable');

    if (isDraggable) {
      return true;
    }
    else {
      return null;
    }
  }.property('isDraggable'),

  handleDragStart: function(event) {

    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = this.get('coordinator').setObject(obj, { source: this });

    dataTransfer.setData('Text', id);

    if (obj) {
      Ember.set(obj, 'isDraggingObject', true);
    }
    this.set('isDraggingObject', true);
  }.on("dragStart"),

  handleDragEnd: function() {
    var obj = this.get('content');

    if (obj) {
      Ember.set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
  }.on("dragEnd"),

  actions: {
    selectForDrag: function() {
      var obj = this.get('content');
      var hashId = this.get('coordinator').setObject(obj, { source: this });
      this.get('coordinator').set("clickedId", hashId);
    }
  }
});
