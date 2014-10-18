//import Ember from 'ember';
import ObjectBin from './object-bin';
import log from '../helpers/log';

export default ObjectBin.extend({
  layoutName: "components/object-bin",

  manageList: false,
  
  inits: function() {
    this._super();
    this.set('manageList',false);
  },

  setTitle: function(obj) {

    var rating = this.get('rating');
    log("setting rating "+rating);
    obj.set("rating",rating);
    obj.save();
    //obj.set("author",name);
    //obj.save();
  }.on("objectDroppedInternal")
});