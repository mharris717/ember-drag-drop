import Ember from 'ember';

export default Ember.Controller.extend({

  dragFinishText: false,
  dragStartedText: false,
  dragEndedText: false,

  actions: {
    dragResult: function(obj,ops) {
      this.set('dragFinishText', ops.target.resultText);
    },
    dragStart: function() {
      this.set('dragEndedText', false);
      this.set('dragStartedText','Drag Has Started');
    },
    dragEnd: function() {
      this.set('dragStartedText', false);
      this.set('dragEndedText','Drag Has Ended');
    },
    draggingOverTarget: function() {
      console.log('Over target');
    },
    leftDragTarget: function() {
      console.log('Off target');
    }

  }
});
