import Ember from 'ember';
import log from '../helpers/log';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ["draggable-object"],
  classNameBindings: ["isDraggingObject"],
  attributeBindings: ['draggable'],

  draggable: function() {
    return "true";
  }.property(),

  handleDragStart: function(event) {
    log("handleDragStart");

    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = this.get('coordinator').setObject(obj, {source: this});

    dataTransfer.setData('Text', id);

    obj.set('isDraggingObject',true);
    this.set('isDraggingObject',true);
    this.sendAction('isDragging', obj);
  }.on("dragStart"),

  handleDragEnd: function() {
    log("handleDragEnd");
    this.set('content.isDraggingObject',false);
    this.set('isDraggingObject',false);
    this.sendAction('isNotDragging');
  }.on("dragEnd"),

  actions: {
    selectForDrag: function() {
      log("selectForDrag");
      var obj = this.get('content');
      var hashId = this.get('coordinator').setObject(obj, {source: this});
      this.get('coordinator').set("clickedId",hashId);
    }
  }
});
