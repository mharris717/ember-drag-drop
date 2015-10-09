import Ember from 'ember';

export default Ember.Controller.extend({

  dragFinishText: false,
  sortableObjectList: Ember.A(
    [{id: 1, title:'Number 1'},
    {id: 2, title:'Number 2'},
    {id: 3, title:'Number 3'},
    {id: 4, title:'Number 4'}]
  ),

  actions: {
    dragResult: function(obj,ops) {
      this.set('dragFinishText', ops.target.resultText);
    },
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    draggingOverTarget: function() {
      console.log('Over target');
    },
    leftDragTarget: function() {
      console.log('Off target');
    },
    sortEndAction: function() {
      console.log('sort Ended', this.get('sortableObjectList'));
    }
  }
});
