import Ember from 'ember';

const {
  computed, inject: { service }, A
} = Ember;

export default Ember.Component.extend( {
  
  dragCoordinator: service(),

  classNameBindings: [':c_sortable-objects', '_group', 'overrideClass'],
  attributeBindings: ['draggable'],

  /* 
    This overrideClass should be deprecated as classes dont need to be passed in via a property
    Functionality and styling should be seperated and theres a bit of an overlap here
    Adding it back for backwards compatibility
  */
  overrideClass: null,

  sortingScope: 'drag-objects',
  
  draggable: 'true',

  enableSort: true,
  sortableObjectList: A(),

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
