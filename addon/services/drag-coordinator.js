import Ember from 'ember';

export default Ember.Service.extend({
  arrayList: Ember.A(),
  newSortedList: Ember.computed('arrayList', function(){
    //TODO: take a copy because, we don't want to trigger changes to the passed in array until after we drop.
    return this.get('arrayList');
  }),
  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  currentOffsetItem: null,
  isMoving: false,
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
    this.set('currentOffsetItem', null);
  },
  draggingOver: function(event, emberObject) {
    var currentOffsetItem = this.get('currentOffsetItem');
    var pos = this.relativeClientPosition(emberObject.$()[0], event);
    var moveDirection = false;
    if (!this.get('lastEvent')) {
      this.set('lastEvent', event);
    }
    if (event.originalEvent.clientY < this.get('lastEvent').originalEvent.clientY) {
      moveDirection = 'up';
    }
    if (event.originalEvent.clientY > this.get('lastEvent').originalEvent.clientY) {
      moveDirection = 'down';
    }
    this.set('lastEvent', event);

    if (!this.get('isMoving')) {
      if (event.target !== this.get('currentDragEvent').target) { //if not dragging over self
        if (currentOffsetItem !== emberObject) {
          if (pos.py > 0.33 && moveDirection === 'up' || pos.py > 0.33 && moveDirection === 'down') {
            this.swapElements(emberObject);
            this.set('currentOffsetItem', emberObject);
          }
        }
      } else {
        //reset because the node moved under the mouse with a swap
        this.set('currentOffsetItem', null);
      }
    }
  },
  swapNodes: function(a, b) {
    var aparent = a.parentNode;
    var asibling = a.nextSibling === b ? a : a.nextSibling;
    b.parentNode.insertBefore(a, b);
    aparent.insertBefore(b, asibling);
  },
  swapObjectPositions: function(a, b) {
    var newList = this.get('newSortedList');
    var aPos = newList.indexOf(a);
    var bPos = newList.indexOf(b);
    newList[aPos] = b;
    newList[bPos] = a;
    this.set('newSortedList', newList);
  },
  swapElements: function(overElement) {
    var draggingItem = this.get('currentDragItem');
    this.swapNodes(draggingItem.$()[0], overElement.$()[0]);
    this.swapObjectPositions(draggingItem.get('content'), overElement.get('content'));
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
    this.set('arrayList', this.get('newSortedList'));
    return this.get('arrayList');
  }
});
