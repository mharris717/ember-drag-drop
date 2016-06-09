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

  dragStart: function() {
    if (!this.get('enableSort')) {
      return;
    }
   if (!this.get('dragCoordinator.currentDragObject')) {
     //prevent dragging if a drag object is not currently being targeted
     return false;
   } else {
     this.set('dragCoordinator.sortComponentController', this);
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
    this.set('dragCoordinator.sortComponentController', null);
  }
});
