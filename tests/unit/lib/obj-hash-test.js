import Ember from 'ember';
import { test } from 'ember-qunit';
import ObjHash from '../../../models/obj-hash';

module("obj hash");

test("smoke", function() {
  var hash = ObjHash.create();
  var obj = 8;

  var id = null;
  Ember.run(function() {
    id = hash.add(obj);
  });
  equal(hash.get('length'),1);

  var objBack = hash.getObj(id);
  equal(obj,objBack);
});