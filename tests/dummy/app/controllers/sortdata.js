import Controller from '@ember/controller';

export default Controller.extend({

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
