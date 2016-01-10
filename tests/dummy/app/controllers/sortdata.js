import Ember from 'ember';

export default Ember.Controller.extend({

  sortFinishText: null,

  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log('Sort Ended', this.get('model.pages'));
    }
  }
});
