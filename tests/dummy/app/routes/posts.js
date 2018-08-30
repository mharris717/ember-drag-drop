import Route from '@ember/routing/route';
import Post from '../models/post';
import log from '../helpers/log';

export default Route.extend({
  beforeModel: function() {
    var me = this;
    var p = this.store.find('post');
    p.then(function(res) {
      log(res);
      if (res.get('length') === 0) {
        var fixtures = Post.FIXTURES;
        for(var i=0;i<fixtures.length;i++) {
          var data = fixtures[i];
          data.rev = null;
          var card = me.store.createRecord('post',data);
          card.save();
        }
      }
    });
    return p;
  },

  model: function() {
    return this.store.find('post');
  }
});
