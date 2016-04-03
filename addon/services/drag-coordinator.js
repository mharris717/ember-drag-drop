import Ember from 'ember';

const {
  computed: { notEmpty }, run: { later }, $, A
} = Ember;

export default Ember.Service.extend({
  
  sortComponents: {}, // Use object for sortComponents so that we can scope per sortingScope

  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  currentOffsetItem: null,

  isMoving: false,
  lastEvent: null,

  enableSort: notEmpty('sortComponents'),

  pushSortComponent(component) {
    var sortingScope = component.get('sortingScope');
    if (!this.get('sortComponents')[sortingScope]) {
      this.get('sortComponents')[sortingScope] = A();
    }
    this.get('sortComponents')[sortingScope].pushObject(component);
  },

  removeSortComponent(component) {
    var sortingScope = component.get('sortingScope');
    this.get('sortComponents')[sortingScope].removeObject(component);
  },

  dragStarted: function(object, event, dragItem) {
    var isEnabled = Object.keys(this.get('sortComponents')).length;

    if (!isEnabled) {
      //disable drag if sorting is disabled this is not used for regular
      event.preventDefault();
      return;
    }

    if (this.get('currentDragItem') !== null) {
      //ignore secondary drag event eg. nested sortable-objects
      return;
    }

    later(function(){
      $(event.target).css('opacity', '0.5');
    });

    this.set('currentDragObject', object);
    this.set('currentDragEvent', event);
    this.set('currentDragItem', dragItem);
    event.dataTransfer.effectAllowed = 'move';
  },

  dragEnded: function(event) {
    $(event.target).css('opacity', '1');
    this.setProperties({
      currentDragObject: null,
      currentDragEvent: null,
      currentDragItem: null,
      currentOffsetItem: null
    });
  },

  draggingOver: function(event, overElement) {
    var currentOffsetItem = this.get('currentOffsetItem');
    var pos = this.relativeClientPosition(overElement.$()[0], event);
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

    var isOverSimilarElement = this.get('currentDragItem.sortingScope') === overElement.get('sortingScope');

    if (!this.get('isMoving')) {
      if (event.target !== this.get('currentDragEvent').target && isOverSimilarElement) {
        //if dragging over another, similar element
        if (currentOffsetItem !== overElement) {
          if (pos.py > 0.33 && moveDirection === 'up' || pos.py > 0.33 && moveDirection === 'down') {
            this.moveElements(overElement);
            this.set('currentOffsetItem', overElement);
          }
        }
      } else {
        //reset because the node moved under the mouse with a move
        this.set('currentOffsetItem', null);
      }
    }
  },

  moveObjectPositions: function(a, b, sortComponents) {
    var aSortable, bSortable;

    aSortable = sortComponents.find((component) => {
      return component.get('sortableObjectList').find((sortable) => {
        return sortable === a;
      });
    });

    bSortable = sortComponents.find((component) => {
      return component.get('sortableObjectList').find((sortable) => {
        return sortable === b;
      });
    });

    var swap = aSortable === bSortable;

    if (swap) {
      // Swap if items are in the same sortable-objects component
      var newList = aSortable.get('sortableObjectList').toArray();
      var newArray = A();
      var aPos = newList.indexOf(a);
      var bPos = newList.indexOf(b);

      newList[aPos] = b;
      newList[bPos] = a;

      newList.forEach(function(item){
        newArray.push(item);
      });
      aSortable.set('sortableObjectList', newArray);
    } else {
      // Move if items are in different sortable-objects component
      var aList = aSortable.get('sortableObjectList');
      var bList = bSortable.get('sortableObjectList');

      // Remove from aList and insert into bList
      aList.removeObject(a);
      bList.insertAt(bList.indexOf(b), a);
    }
  },

  moveElements: function(overElement) {

    var isEnabled = Object.keys(this.get('sortComponents')).length;
    if (!isEnabled) {
      return;
    }

    var draggingItem = this.get('currentDragItem');

    var sortComponents = this.get('sortComponents')[draggingItem.get('sortingScope')];

    this.moveObjectPositions(draggingItem.get('content'), overElement.get('content'), sortComponents);

    sortComponents.forEach((component) => {
      component.rerender();
    });
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
