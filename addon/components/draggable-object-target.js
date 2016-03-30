import Ember from 'ember';
import Droppable from 'ember-drag-drop/mixins/droppable';

export default Ember.Component.extend(Droppable, {
  
  classNameBindings: [':c_draggable-object-target', 'overrideClass'],

  /* 
    This overrideClass should be deprecated as classes dont need to be passed in via a property
    Functionality and styling should be seperated and theres a bit of an overlap here
    Adding it back for backwards compatibility
  */
  overrideClass: null,

  isOver: false,

  handlePayload: function(payload) {
    var obj = this.get('coordinator').getObject(payload,{target: this});
    this.sendAction('action',obj,{target: this});
  },

  handleDrop: function(event) {
    var dataTransfer = event.dataTransfer;
    var payload = dataTransfer.getData("Text");
    this.handlePayload(payload);
  },

  acceptDrop: function(event) {
    this.handleDrop(event);
    //Firefox is navigating to a url on drop sometimes, this prevents that from happening
    event.preventDefault();
  },
  handleDragOver: function() {
    if (!this.get('isOver')) {
      //only send once per hover event
      this.set('isOver', true);
      this.sendAction('dragOverAction');
    }
  },
  handleDragOut: function() {
    this.set('isOver', false);
    this.sendAction('dragOutAction');
  },

  click(e) {
    let onClick = this.get('onClick');
    if (onClick) {
      onClick(e.originalEvent);
    }
  },

  actions: {
    acceptForDrop: function() {
      var hashId = this.get('coordinator.clickedId');
      this.handlePayload(hashId);
    }
  }
});
