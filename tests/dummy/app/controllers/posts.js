import Ember from 'ember';

export default Ember.ArrayController.extend({
  draftPosts: Ember.computed.filterBy("model","rating","draft"),
  readyPosts: Ember.computed.filterBy("model","rating","ready"),
  unclassifiedPosts: Ember.computed.filterBy("model","rating","unclassified"),

  actions: {
    resetRatings: function() {
      this.get('model').forEach(function(post) {
        post.set('rating','unclassified');
        post.save();
      });
    }
  }
});
