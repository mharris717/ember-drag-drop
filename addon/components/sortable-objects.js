import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  dragCoordinator: service('drag-coordinator'),
  overrideClass: 'sortable-objects',
  classNameBindings: ['overrideClass'],
  enableSort: true,
  useSwap: true,
  inPlace: false,
  sortingScope: 'drag-objects',
  sortableObjectList: A(),

  init() {
    this._super(...arguments);
    if (this.enableSort) {
      this.dragCoordinator.pushSortComponent(this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.enableSort) {
      this.dragCoordinator.removeSortComponent(this);
    }
  },

  dragStart(event) {
    event.stopPropagation();
    if (!this.enableSort) {
      return false;
    }
    this.set('dragCoordinator.sortComponentController', this);
  },

  dragEnter(event) {
    //needed so drop event will fire
    event.stopPropagation();
    return false;
  },

  dragOver(event) {
    //needed so drop event will fire
    event.stopPropagation();
    return false;
  },

  drop(event) {
    event.stopPropagation();
    event.preventDefault();
    this.set('dragCoordinator.sortComponentController', undefined);
    if (this.enableSort && this.sortEndAction) {
      this.sortEndAction(event);
    }
  },
});
