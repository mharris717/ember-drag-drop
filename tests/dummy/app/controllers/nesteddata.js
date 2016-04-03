import Ember from 'ember';

export default Ember.Controller.extend({

  sortFinishText: null,
  books: Ember.computed.alias('model'),

  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log('Sort Ended', this.get('books').mapBy('title'));
    }
  }
});