import Ember from 'ember';
import log from '../helpers/log';

export default Ember.ArrayController.extend({
  draftPosts: Ember.computed.filterBy("model","rating","draft"),
  readyPosts: Ember.computed.filterBy("model","rating","ready"),
  unclassifiedPosts: Ember.computed.filterBy("model","rating","unclassified"),

  watchObjectDropped: function() {
    log("posts controller objectDropped");
  }.on("objectDropped"),

  watchObjectDroppedc: function() {
    log("posts controller objectDroppedc");
  }.on("objectDroppedc"),

  objectDropped: function() {
    log("posts controller objectDropped method");
  },


  actions: {
    resetRatings: function() {
      this.get('model').forEach(function(post) {
        post.set('rating','unclassified');
        post.save();
      });
    },

    objectDropped: function(ops) {
      var bin = ops.bin;
      var obj = ops.obj;
      log("posts controller action objectDropped obj " + obj.get('title') + " bin " + bin.get('name'));
    }
  }
});
