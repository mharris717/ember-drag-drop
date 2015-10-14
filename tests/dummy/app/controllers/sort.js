import Ember from 'ember';

export default Ember.Controller.extend({

  sortFinishText: null,
  sortableObjectList: Ember.A(
    [{id: 1, title:'Number 1'},
    {id: 2, title:'Number 2'},
    {id: 3, title:'Number 3'},
    {id: 4, title:'Number 4'}]
  ),

  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log('Sort Ended', this.get('sortableObjectList'));
    }
  }
});
