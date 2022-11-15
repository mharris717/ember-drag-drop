/* global equal*/
import { registerHelper } from '@ember/test';

var f = function () {
  registerHelper('equalProp', function (app, obj, prop, exp) {
    equal(obj.get(prop), exp, 'Expected ' + prop + ' to equal ' + exp);
  });

  registerHelper('equalLength', function (app, arr, expLength) {
    var l = arr.length;
    if (!l && arr.get) {
      l = arr.get('length');
    }

    equal(l, expLength, 'Expected list of length ' + expLength + ' Got ' + l);
  });
};

f();

export default f;
