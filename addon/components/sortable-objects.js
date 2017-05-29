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

  dragStart: function() {
    if (!this.get('enableSort')) {
      return false;
    }
    this.set('dragCoordinator.sortComponentController', this);
  },

  dragEnter: function() {
    //needed so drop event will fire
    return false;
  },

  dragOver: function() {
    //needed so drop event will fire
    return false;
  },

  drop: function(event) {
    if (this.get('enableSort')) {
      this.sendAction('sortEndAction', event);
    }
  }
});
