//import Ember from 'ember';
import ObjectBin from './object-bin';

export default ObjectBin.extend({
  layoutName: "components/object-bin",

  manageList: false,
  
  inits: function() {
    this._super();
    this.set('manageList',false);
  },

  setTitle: function(obj) {

    var rating = this.get('rating');
    console.debug("setting rating "+rating);
    obj.set("rating",rating);
    obj.save();
    //obj.set("author",name);
    //obj.save();
  }.on("objectDropped")
});