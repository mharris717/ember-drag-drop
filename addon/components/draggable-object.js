import Ember from 'ember';

export default Ember.Component.extend({
  dragCoordinator: Ember.inject.service(),
  tagName: "div",
  overrideClass: 'draggable-object',
  classNameBindings: [':js-draggableObject','isDraggingObject:is-dragging-object:', 'overrideClass'],
  attributeBindings: ['draggable'],
  isDraggable: true,
  isSortable: false,
  title: Ember.computed.alias('content.title'),

  draggable: Ember.computed('isDraggable', function() {
    var isDraggable = this.get('isDraggable');

    if (isDraggable) {
      return true;
    }
    else {
      return null;
    }
  }),

  dragStart: function(event) {
    if (!this.get('isDraggable')) {
      event.preventDefault();
      return;
    }
    if (this.get('dragHandle')) {
      //only start when drag handle is activated
      if (!this.$(this.get('dragHandle')).is(':hover')) {
        event.preventDefault();
        return;
      }
    }

    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = this.get('coordinator').setObject(obj, { source: this });

    dataTransfer.setData('Text', id);

    if (obj) {
      Ember.set(obj, 'isDraggingObject', true);
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
      Ember.set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
    this.get('dragCoordinator').dragEnded(event);
    this.sendAction('dragEndAction', obj);
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
