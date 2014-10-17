import Ember from 'ember';
import Droppable from '../mixins/droppable';

export default Ember.Component.extend(Droppable, {
  classNames: ["draggable-object-target"],
  
  handlePayload: function(payload) {
    console.debug("in handlePayload");
    var obj = this.get('coordinator').getObject(payload,{target: this});
    this.sendAction('action',obj);
    //throw obj.get("rating");
    // obj.set('rating','good');
    // if (obj.save) {
    //   obj.save();
    // }
  },

  handleDrop: function(event) {
    var dataTransfer = event.dataTransfer;
    var payload = dataTransfer.getData("Text");
    this.handlePayload(payload);
  },

  acceptDrop: function(event) {
    this.handleDrop(event);
  },

  actions: {
    acceptForDrop: function() {
      var hashId = this.get('coordinator.clickedId');
      this.handlePayload(hashId);
    }
  }
});