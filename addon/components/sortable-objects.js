import Ember from 'ember';

const {
  computed, inject: { service }
} = Ember;

export default Ember.Component.extend( {
  
  dragCoordinator: service(),

  groupName: null,

  classNameBindings: [':c_sortable-objects', '_group'],
  attributeBindings: ['draggable'],

  _group: computed('groupName', function() {
    return this.get('groupName') ? 'js-' + this.get('groupName') : 'js-drag-objects'; 
  }),
  
  draggable: 'true',

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
