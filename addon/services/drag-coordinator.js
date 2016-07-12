import Ember from 'ember';

export default Ember.Service.extend({
  sortComponentController: null,
  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  currentOffsetItem: null,
  isMoving: false,
  lastEvent: null,

  arrayList: Ember.computed.alias('sortComponentController.sortableObjectList'),
  enableSort: Ember.computed.alias('sortComponentController.enableSort'),
  useSwap: Ember.computed.alias('sortComponentController.useSwap'),

  dragStarted: function(object, event, emberObject) {
    if (!this.get('enableSort') && this.get('sortComponentController')) {
      //disable drag if sorting is disabled this is not used for regular
      event.preventDefault();
      return;
    }
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
            this.reorderElements(emberObject);
            this.set('currentOffsetItem', emberObject);
          }
        }
      } else {
        //reset because the node moved under the mouse with a swap
        this.set('currentOffsetItem', null);
      }
    }
  },
  swapObjectPositions: function(a, b) {
    var newList = this.get('arrayList').toArray();
    var newArray = Ember.A();
    var aPos = newList.indexOf(a);
    var bPos = newList.indexOf(b);
    newList[aPos] = b;
    newList[bPos] = a;
    newList.forEach(function(item){
      newArray.push(item);
    });
    this.set('sortComponentController.sortableObjectList', newArray);
  },
  shiftElementPositions: function(a, b) {
    var newList = this.get('arrayList').toArray();
    var newArray = Ember.A();
    var aPos = newList.indexOf(a);
    var bPos = newList.indexOf(b);

    newList.splice(aPos, 1);
    newList.splice(bPos, 0, a);

    newList.forEach(function(item){
      newArray.push(item);
    });

    this.set('sortComponentController.sortableObjectList', newArray);
  },
  reorderElements: function(overElement) {
    var draggingItem = this.get('currentDragItem');

    if (this.get('useSwap')) {
      this.swapObjectPositions(draggingItem.get('content'), overElement.get('content'));
    } else {
      this.shiftElementPositions(draggingItem.get('content'), overElement.get('content'));
    }
    this.get('sortComponentController').rerender();
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
  }
});
