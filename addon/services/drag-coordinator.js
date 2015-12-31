import Ember from 'ember';

export default Ember.Service.extend({
  componentController: null,
  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  currentOffsetItem: null,
  isMoving: false,
  lastEvent: null,

  arrayList: Ember.computed.alias('componentController.sortableObjectList'),
  enableSort: Ember.computed.alias('componentController.enableSort'),

  dragStarted: function(object, event, emberObject) {
    if (!this.get('enableSort')) {
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
    if (!this.get('enableSort')) {
      return;
    }
    Ember.$(event.target).css('opacity', '1');
    this.set('currentDragObject', null);
    this.set('currentDragEvent', null);
    this.set('currentDragItem', null);
    this.set('currentOffsetItem', null);
  },
  draggingOver: function(event, emberObject) {
    if (!this.get('enableSort')) {
      return;
    }
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
    this.set('componentController.sortableObjectList', newArray);
  },
  swapElements: function(overElement) {
    var draggingItem = this.get('currentDragItem');
    this.swapObjectPositions(draggingItem.get('content'), overElement.get('content'));
    this.get('componentController').rerender();
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
