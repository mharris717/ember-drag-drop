import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div", 
  classNames: ["draggable-object"],
  classNameBindings: ["isDraggingObject"],
  attributeBindings: ['draggable'],

  draggable: function() {
    return "true";
  }.property(),

  handleDragStart: function(event) {
    console.debug("handleDragStart");
    
    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = this.get('coordinator').setObject(obj, {source: this});

    dataTransfer.setData('Text', id);

    this.set('isDraggingObject',true);
  }.on("dragStart"),

  handleDragEnd: function() {
    console.debug("handleDragEnd");
    this.set('isDraggingObject',false);
  }.on("dragEnd"),

  actions: {
    selectForDrag: function() {
      console.debug("selectForDrag");
      var obj = this.get('content');
      var hashId = this.get('coordinator').setObject(obj, {source: this});
      this.get('coordinator').set("clickedId",hashId);
    }
  }
});