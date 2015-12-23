/* global equal*/
import Ember from 'ember';

var f = function() {
  Ember.Test.registerHelper('equalProp', function(app,obj,prop,exp) {
    equal(obj.get(prop),exp,"Expected " + prop + " to equal " + exp);
  });

  Ember.Test.registerHelper('equalLength', function(app,arr,expLength) {
    var l = arr.length;
    if (!l && arr.get) {
      l = arr.get('length');
    }

    equal(l,expLength,"Expected list of length "+expLength+" Got "+l);
  });
};

f();

export default f;