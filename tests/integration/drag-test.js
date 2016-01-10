/*global module, equal */
import Em from 'ember';
import startApp from '../helpers/start-app';
import { test } from 'ember-qunit';

var App;

module('Integration - Drag', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Em.run(App, App.destroy);
  }
});

test("smoke", function() {
  equal(2,2);
});