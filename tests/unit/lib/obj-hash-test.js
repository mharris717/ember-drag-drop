import Ember from 'ember';
import {test, module} from 'ember-qunit';
import ObjHash from '../../../models/obj-hash';

module("obj hash");

test("smoke", function(assert) {
  let hash = ObjHash.create(),
      obj  = 8,
      id   = null;

  Ember.run(() => id = hash.add(obj));

  assert.equal(hash.get('length'), 1);

  let objBack = hash.getObj(id);
  assert.equal(obj, objBack);
});