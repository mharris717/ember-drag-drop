import Ember from 'ember';

const {
  inject: { service }, computed, computed: { alias }, set
} = Ember;

export default Ember.Component.extend({

  dragCoordinator: service(),

  classNameBindings: [':c_draggable-object', 'isDraggingObject', '_group', 'overrideClass'],
  attributeBindings: ['dragReady:draggable'],

  /* 
    This overrideClass should be deprecated as classes dont need to be passed in via a property
    Functionality and styling should be seperated and theres a bit of an overlap here
    Adding it back for backwards compatibility
  */
  overrideClass: null,

  groupName: null,

  _group: computed('groupName', function() {
    return this.get('groupName') ? 'js-' + this.get('groupName') : 'js-drag-objects'; 
  }),

  isDraggable: true,
  dragReady: true,
  isSortable: false,

  title: alias('content.title'),

  draggable: computed('isDraggable', function() {
    return this.get('isDraggable')? true : null;
  }),

  didInsertElement: function() {
    let self = this;
    //if there is a drag handle watch the mouse up and down events to trigger if drag is allowed
    if (this.get('dragHandle')) {
      //only start when drag handle is activated
      if (this.$(this.get('dragHandle'))) {
        this.set('dragReady', false);
        this.$(this.get('dragHandle')).on('mouseover', function(){
          self.set('dragReady', true);
        });
        this.$(this.get('dragHandle')).on('mouseout', function(){
          self.set('dragReady', false);
        });
      }
    }
  },

  willDestroyElement: function(){
    if (this.$(this.get('dragHandle'))) {
      this.$(this.get('dragHandle')).off();
    }
  },

  dragStart: function(event) {
    if (!this.get('isDraggable') || !this.get('dragReady')) {
      event.preventDefault();
      return;
    }

    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = null;
    if (this.get('coordinator')) {
       id = this.get('coordinator').setObject(obj, { source: this });
    }


    dataTransfer.setData('Text', id);

    if (obj) {
      set(obj, 'isDraggingObject', true);
    }
    this.set('isDraggingObject', true);
    this.get('dragCoordinator').dragStarted(obj, event, this);
    this.sendAction('dragStartAction', obj);
    if (this.get('isSortable')) {
      this.sendAction('draggingSortItem', obj);
    }
  },

  dragEnd: function(event) {
    if (!this.get('isDraggingObject')) {
      return;
    }

    var obj = this.get('content');

    if (obj) {
      set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
    this.get('dragCoordinator').dragEnded(event);
    this.sendAction('dragEndAction', obj);
    if (this.get('dragHandle')) {
      this.set('dragReady', false);
    }
  },

  dragOver: function(event) {
   if (this.get('isSortable')) {
     this.get('dragCoordinator').draggingOver(event, this);
   }
    return false;
  },

  drop: function(event) {
    //Firefox is navigating to a url on drop, this prevents that from happening
    event.preventDefault();
  },

  actions: {
    selectForDrag: function() {
      var obj = this.get('content');
      var hashId = this.get('coordinator').setObject(obj, { source: this });
      this.set('coordinator.clickedId', hashId);
    }
  }
});
