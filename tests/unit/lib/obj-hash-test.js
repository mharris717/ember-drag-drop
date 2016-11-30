import Ember from 'ember';
import { test, module } from 'ember-qunit';
import ObjHash from '../../../models/obj-hash';

module("obj hash");

test("smoke", function(assert) {
  var hash = ObjHash.create();
  var obj = 8;

  var id = null;
  Ember.run(function() {
    id = hash.add(obj);
  });
  assert.equal(hash.get('length'),1);

  var objBack = hash.getObj(id);
  assert.equal(obj,objBack);
});