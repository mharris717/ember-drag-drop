import Ember from 'ember';

export default Ember.Component.extend( {
  dragCoordinator: Ember.inject.service(),
  attributeBindings: ['draggable'],
  draggable: 'true',
  tagName: 'div',
  overrideClass: 'sortable-objects',
  classNameBindings: ['overrideClass'],
  enableSort: true,
  sortableObjectList: Ember.A(),

  didInsertElement() {
    this.set('dragCoordinator.componentController', this);
  },
  willDestroyElement() {
    this.set('dragCoordinator.componentController', null);
  },
  dragStart: function() {
    //left blank on purpose
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
