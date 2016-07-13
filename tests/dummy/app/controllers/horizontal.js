import Ember from 'ember';

export default Ember.Controller.extend({
  useSwap: true,
  sortFinishText: null,
  sortableObjectList: Ember.A(
    [{id: 1, title:'Number 1'},
      {id: 2, title:'Number 2'},
      {id: 3, title:'Number 3'},
      {id: 4, title:'Number 4'},
      {id: 5, title:'Number 5'},
      {id: 6, title:'Number 6'},
      {id: 7, title:'Number 7'},
      {id: 8, title:'Number 8'}]
  ),

  actions: {
    sortEndAction: function() {
      console.log('Sort Ended', this.get('sortableObjectList'));
    }
  }
});
