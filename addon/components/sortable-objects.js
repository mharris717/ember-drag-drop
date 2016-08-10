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

  didInsertElement() {
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
