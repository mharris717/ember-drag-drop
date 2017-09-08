import Ember from 'ember';

function swapInPlace(items, a, b) {
  const aPos = items.indexOf(a);
  const bPos = items.indexOf(b);

  items.replace(aPos, 1, [ b ]);
  items.replace(bPos, 1, [ a ]);
}

function shiftInPlace(items, a, b) {
  const aPos = items.indexOf(a);
  const bPos = items.indexOf(b);

  items.removeAt(aPos);
  items.insertAt(bPos, a);
}

export default Ember.Service.extend({
  sortComponentController: null,
  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  currentOffsetItem: null,
  isMoving: false,
  lastEvent: null,
  sortComponents: {}, // Use object for sortComponents so that we can scope per sortingScope

  arrayList: Ember.computed.alias('sortComponentController.sortableObjectList'),
  enableSort: Ember.computed.alias('sortComponentController.enableSort'),
  useSwap: Ember.computed.alias('sortComponentController.useSwap'),
  inPlace: Ember.computed.alias('sortComponentController.inPlace'),

  pushSortComponent(component) {
    const sortingScope = component.get('sortingScope');
    if (!this.get('sortComponents')[sortingScope]) {
      this.get('sortComponents')[sortingScope] = Ember.A();
    }
    this.get('sortComponents')[sortingScope].pushObject(component);
  },

  removeSortComponent(component) {
    const sortingScope = component.get('sortingScope');
    this.get('sortComponents')[sortingScope].removeObject(component);
  },

  dragStarted(object, event, emberObject) {
    this.set('currentDragObject', object);
    this.set('currentDragEvent', event);
    this.set('currentDragItem', emberObject);
    event.dataTransfer.effectAllowed = 'move';
  },

  dragEnded() {
    this.set('currentDragObject', null);
    this.set('currentDragEvent', null);
    this.set('currentDragItem', null);
    this.set('currentOffsetItem', null);
  },

  draggingOver(event, emberObject) {
    const currentOffsetItem = this.get('currentOffsetItem');
    const pos = this.relativeClientPosition(emberObject.$()[0], event);
    const hasSameSortingScope = this.get('currentDragItem.sortingScope') === emberObject.get('sortingScope');
    let moveDirection = false;

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
      if (event.target !== this.get('currentDragEvent').target && hasSameSortingScope) { //if not dragging over self
        if (currentOffsetItem !== emberObject) {
          if (pos.py > 0.33 && moveDirection === 'up' || pos.py > 0.33 && moveDirection === 'down') {

            this.moveElements(emberObject);
            this.set('currentOffsetItem', emberObject);
          }
        }
      } else {
        //reset because the node moved under the mouse with a move
        this.set('currentOffsetItem', null);
      }
    }
  },

  moveObjectPositions(a, b, sortComponents) {
    const aSortable = sortComponents.find((component) => {
      return component.get('sortableObjectList').find((sortable) => {
        return sortable === a;
      });
    });
    const bSortable = sortComponents.find((component) => {
      return component.get('sortableObjectList').find((sortable) => {
        return sortable === b;
      });
    });
    const swap = aSortable === bSortable;

    if (swap) {

      let list = aSortable.get('sortableObjectList');
      if (!this.get('inPlace')) {
        list = list.toArray();
      }

      if (this.get('useSwap')) {
        swapInPlace(list, a, b);
      } else {
        shiftInPlace(list, a, b);
      }

      if (!this.get('inPlace')) {
        aSortable.set('sortableObjectList', list);
      }

    } else {
      // Move if items are in different sortable-objects component
      const aList = aSortable.get('sortableObjectList');
      const bList = bSortable.get('sortableObjectList');

      // Remove from aList and insert into bList
      aList.removeObject(a);
      bList.insertAt(bList.indexOf(b), a);
    }
  },

  moveElements(overElement) {
    const isEnabled = Object.keys(this.get('sortComponents')).length;
    const draggingItem = this.get('currentDragItem');
    const sortComponents = this.get('sortComponents')[draggingItem.get('sortingScope')];

    if (!isEnabled) {
      return;
    }

    this.moveObjectPositions(draggingItem.get('content'), overElement.get('content'), sortComponents);

    sortComponents.forEach((component) => {
      component.rerender();
    });
  },

  relativeClientPosition(el, event) {
    const rect = el.getBoundingClientRect();
    const x = event.originalEvent.clientX - rect.left;
    const y = event.originalEvent.clientY - rect.top;

    return {
      x: x,
      y: y,
      px: x / rect.width,
      py: y / rect.height
    };
  }
});
