import Ember from 'ember';

export default Ember.Component.extend( {
  dragCoordinator: Ember.inject.service(),
  attributeBindings: ['draggable'],
  draggable: 'true',
  tagName: 'div',
  overrideClass: 'sortable-objects',
  draggableType: 'default',
  classNameBindings: ['overrideClass'],
  enableSort: true,
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
  dragStart: function(event) {
    if (!this.get('enableSort')) {
      event.preventDefault();
      return;
    }
  },
  dragOver: function() {
    //needed so drop event will fire
    return false;
  },
  drop: function() {
    if (this.get('enableSort')) {
      this.sendAction('sortEndAction');
    }
  }
});
