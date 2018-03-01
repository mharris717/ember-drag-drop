import Controller from '@ember/controller';

export default Controller.extend({

  dragFinishText: false,
  dragStartedText: false,
  dragEndedText: false,

  init: function() {
    this._super(...arguments);
    this.set('myObject', {id: 1, name: 'objectName'})
  },

  actions: {
    dragResult: function(obj,ops) {
      this.set('dragFinishText', ops.target.resultText);
      console.log('Content of draggable-object :',obj);
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
