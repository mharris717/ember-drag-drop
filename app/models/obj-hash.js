import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';

export default EmberObject.extend({
  contentLength: 0,
  length: alias('contentLength'),

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
      throw new Error("no obj for key "+key);
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
    return A(res);
  },
});
