import Ember from 'ember';

export default Ember.Service.extend({
  arrayList: null,
  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  lastEvent: null,

  dragStarted: function(object, event, emberObject) {
    Ember.run.later(function(){
      Ember.$(event.target).css('opacity', '0.5');
    });
    this.set('currentDragObject', object);
    this.set('currentDragEvent', event);
    this.set('currentDragItem', emberObject);
    event.dataTransfer.effectAllowed = 'move';
  },
  dragEnded: function(event) {
    Ember.$(event.target).css('opacity', '1');
    this.set('currentDragObject', null);
    this.set('currentDragEvent', null);
    this.set('currentDragItem', null);
  },
  draggingOver: function(event, emberObject) {
    var currentDragItem = this.get('currentDragItem');
    var isMoving = this.isMoving(emberObject.$()[0], event);
    this.set('lastEvent', event);

    if (isMoving && emberObject.get('content') !== currentDragItem.get('content')) {
      // Only if not dragging over self
      this.insertElementOver(currentDragItem, emberObject);
    }
  },
  isMoving: function(el, event) {
    var pos = this.relativeClientPosition(el, event);
    var isMoving = false;
    var lastEvent = this.get('lastEvent');

    if (lastEvent && ((pos.px > 0.33 && event.originalEvent.clientX != lastEvent.originalEvent.clientX) ||
      (pos.py > 0.33 && event.originalEvent.clientY != lastEvent.originalEvent.clientY))) {
      isMoving = true;
    }
    return isMoving;
  },
  insertElementOver: function(currentDragItem, overElement) {
    var arrayList = this.get('arrayList');
    var index = arrayList.indexOf(overElement.get('content'));
    arrayList.removeObject(currentDragItem.get('content'));
    arrayList.insertAt(index, currentDragItem.get('content'));
    return;
  },
  relativeClientPosition: function (el, event) {
    var rect = el.getBoundingClientRect();
    var x = event.originalEvent.clientX - rect.left;
    var y = event.originalEvent.clientY - rect.top;
    return {
      x: x,
      y: y,
      px: x / rect.width,
      py: y / rect.height
    };
  },
  getChangedArray: function() {
    return this.get('arrayList').toArray();
  }
});
