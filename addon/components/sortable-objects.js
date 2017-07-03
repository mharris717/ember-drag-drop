import Ember from 'ember';

export default Ember.Component.extend( {
  dragCoordinator: Ember.inject.service(),
  tagName: 'div',
  overrideClass: 'sortable-objects',
  classNameBindings: ['overrideClass'],
  enableSort: true,
  useSwap: true,
  sortingScope: 'drag-objects',
  sortableObjectList: Ember.A(),

  init() {
    this._super(...arguments);
    if (this.get('enableSort')) {
      this.get('dragCoordinator').pushSortComponent(this);
    }
  },

  willDestroyElement() {
    if (this.get('enableSort')) {
      this.get('dragCoordinator').removeSortComponent(this);
    }
  },

  dragStart: function(event) {
    event.stopPropagation();
    if (!this.get('enableSort')) {
      return false;
    }
    this.set('dragCoordinator.sortComponentController', this);
  },

  dragEnter: function(event) {
    //needed so drop event will fire
    event.stopPropagation();
    return false;
  },

  dragOver: function(event) {
    //needed so drop event will fire
    event.stopPropagation();
    return false;
  },

  drop: function(event) {
    event.stopPropagation();
    if (this.get('enableSort')) {
      this.sendAction('sortEndAction', event);
    }
  }
});
