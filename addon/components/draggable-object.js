import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  overrideClass: 'draggable-object',
  classNameBindings: ["isDraggingObject:is-dragging-object:", 'overrideClass'],
  attributeBindings: ['draggable'],
  isDraggable: true,
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

    var dataTransfer = event.dataTransfer;

    var obj = this.get('content');
    var id = this.get('coordinator').setObject(obj, { source: this });

    dataTransfer.setData('Text', id);

    if (obj) {
      Ember.set(obj, 'isDraggingObject', true);
    }
    this.set('isDraggingObject', true);
    this.sendAction('dragStartAction', obj);
  },

  dragEnd: function() {
    if (!this.get('isDraggable')) {
      return;
    }

    var obj = this.get('content');

    if (obj) {
      Ember.set(obj, 'isDraggingObject', false);
    }
    this.set('isDraggingObject', false);
    this.sendAction('dragEndAction', obj);
  },

  actions: {
    selectForDrag: function() {
      var obj = this.get('content');
      var hashId = this.get('coordinator').setObject(obj, { source: this });
      this.set('coordinator.clickedId', hashId);
    }
  }
});
