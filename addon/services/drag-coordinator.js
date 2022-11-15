import Service from '@ember/service';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';
import { isEqual } from '@ember/utils';

function indexOf(items, a) {
  return items.findIndex(function (element) {
    return isEqual(element, a);
  });
}

function swapInPlace(items, a, b) {
  const aPos = indexOf(items, a);
  const bPos = indexOf(items, b);

  items.replace(aPos, 1, [b]);
  items.replace(bPos, 1, [a]);
}

function shiftInPlace(items, a, b) {
  const aPos = indexOf(items, a);
  const bPos = indexOf(items, b);

  items.removeAt(aPos);
  items.insertAt(bPos, a);
}

export default Service.extend({
  sortComponentController: null,
  currentDragObject: null,
  currentDragEvent: null,
  currentDragItem: null,
  currentOffsetItem: null,
  isMoving: false,
  lastEvent: null,

  init() {
    this._super(...arguments);
    // Use object for sortComponents so that we can scope per sortingScope
    this.set('sortComponents', {});
  },

  arrayList: alias('sortComponentController.sortableObjectList'),
  enableSort: alias('sortComponentController.enableSort'),
  useSwap: alias('sortComponentController.useSwap'),
  inPlace: alias('sortComponentController.inPlace'),

  pushSortComponent(component) {
    const sortingScope = component.get('sortingScope');
    if (!this.sortComponents[sortingScope]) {
      this.sortComponents[sortingScope] = A();
    }
    this.sortComponents[sortingScope].pushObject(component);
  },

  removeSortComponent(component) {
    const sortingScope = component.get('sortingScope');
    this.sortComponents[sortingScope].removeObject(component);
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
    const currentOffsetItem = this.currentOffsetItem;
    const pos = this.relativeClientPosition(emberObject.element, event);
    const hasSameSortingScope =
      this.get('currentDragItem.sortingScope') ===
      emberObject.get('sortingScope');
    let moveDirections = [];

    if (!this.lastEvent) {
      this.set('lastEvent', event);
    }

    if (event.clientY < this.lastEvent.clientY) {
      moveDirections.push('up');
    }

    if (event.clientY > this.lastEvent.clientY) {
      moveDirections.push('down');
    }

    if (event.clientX < this.lastEvent.clientX) {
      moveDirections.push('left');
    }

    if (event.clientX > this.lastEvent.clientX) {
      moveDirections.push('right');
    }

    this.set('lastEvent', event);

    if (!this.isMoving && this.currentDragEvent) {
      if (
        event.target !== this.currentDragEvent.target &&
        hasSameSortingScope
      ) {
        //if not dragging over self
        if (currentOffsetItem !== emberObject) {
          if (
            (pos.py < 0.67 && moveDirections.indexOf('up') >= 0) ||
            (pos.py > 0.33 && moveDirections.indexOf('down') >= 0) ||
            (pos.px < 0.67 && moveDirections.indexOf('left') >= 0) ||
            (pos.px > 0.33 && moveDirections.indexOf('right') >= 0)
          ) {
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
        return isEqual(sortable, a);
      });
    });
    const bSortable = sortComponents.find((component) => {
      return component.get('sortableObjectList').find((sortable) => {
        return isEqual(sortable, b);
      });
    });
    const swap = aSortable === bSortable;

    if (swap) {
      let list = aSortable.get('sortableObjectList');
      if (!this.inPlace) {
        list = A(list.toArray());
      }

      if (this.useSwap) {
        swapInPlace(list, a, b);
      } else {
        shiftInPlace(list, a, b);
      }

      if (!this.inPlace) {
        aSortable.set('sortableObjectList', list);
      }
    } else {
      // Move if items are in different sortable-objects component
      const aList = aSortable.get('sortableObjectList');
      const bList = bSortable.get('sortableObjectList');

      // Remove from aList and insert into bList
      aList.removeObject(a);
      bList.insertAt(indexOf(bList, b), a);
    }
  },

  moveElements(overElement) {
    const isEnabled = Object.keys(this.sortComponents).length;
    const draggingItem = this.currentDragItem;
    const sortComponents =
      this.sortComponents[draggingItem.get('sortingScope')];

    if (!isEnabled) {
      return;
    }

    this.moveObjectPositions(
      draggingItem.get('content'),
      overElement.get('content'),
      sortComponents
    );

    sortComponents.forEach((component) => {
      component.rerender();
    });
  },

  relativeClientPosition(el, event) {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {
      x: x,
      y: y,
      px: x / rect.width,
      py: y / rect.height,
    };
  },
});
