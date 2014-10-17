import Ember from 'ember';

var isNumber = function(obj) {
  var a = obj-1;
  var b = obj+1;
  return (b-a)===2;
};

var FakeStore = Ember.Object.extend({
  findSingle: function(name,id) {
    var me = this;
    return new Ember.RSVP.Promise(function(success,failure) {
      var all = me.get('all');
      var res  = null;
      all.forEach(function(obj) {
        if (obj.get('id') === id) {
          res = obj;
        }
      });

      success(res);
    });
  },

  find: function(name,ops) {
    ops = ops || {};
    if (isNumber(ops)) {
      return this.findSingle(name,ops);
    }
    else {
      return this.findMultiple(name,ops);
    }
  }
});

FakeStore.reopenClass({
  makeNumberStore: function(max) {
    var all = [];
    for (var i=1;i<=max;i++) {
      all.push(Ember.Object.create({id: i}));
    }
    return this.create({all: all});
  }
});

export default FakeStore;