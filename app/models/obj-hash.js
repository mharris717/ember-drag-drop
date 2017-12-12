import Ember from 'ember';

export default Ember.Object.extend({
  contentLength: 0,
  length: Ember.computed.alias('contentLength'),

  init: function() {
    this._super();
    this.content = {};
  },

  add: function(obj) {
    var id = this.generateId();
    this.get('content')[id] = obj;
    this.incrementProperty("contentLength");
    return id;
  },

  getObj: function(key) {
    var res = this.get('content')[key];
    if (!res) {
      throw "no obj for key "+key;
    }
    return res;
  },

  generateId: function() {
    var num = Math.random() * 1000000000000.0;
    num = parseInt(num);
    num = ""+num;
    return num;
  },

  keys: function() {
    var res = [];
    for (var key in this.get('content')) {
      res.push(key);
    }
    return Ember.A(res);
  },


});
