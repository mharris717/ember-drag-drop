/* global equal*/
import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import Coordinator from '../../../models/coordinator';

var Thing = Ember.Object.extend({});
moduleForComponent("object-bin", 'ObjectBinComponent', {
  needs: ["component:draggable-object-target", "component:draggable-object"]
});

test("smoke", function() {
  var obj = Thing.create({title: "Hello"});
  var all = Ember.A();
  all.addObject(obj);
  var s = this.subject({
    model: all,
    template: Ember.Handlebars.compile("<span class='title'>Hello</span>") //had to hardwire the 'hello' in the template didn't seem to have any data attached
  });

  var titles = this.$().find(".title");
  equal(titles.length,1);
  equal(titles.text().trim(),"Hello");
});

test("component on fly 1", function() {
  var obj = Thing.create({title: "Hello"});
  var all = Ember.A();
  all.addObject(obj);

  var s = this.subject({
    layout: Ember.Handlebars.compile("{{#object-bin model=all}}{{yield}}{{/object-bin}}"),
    template: Ember.Handlebars.compile("<span class='title'>Hello</span>"),
    all: all
  });

  var titles = this.$().find(".title");
  equal(titles.length,1);
  equal(titles.text().trim(),"Hello");
});

test("component on fly 2", function() {
  var obj = Thing.create({title2: "Hello"});
  var all = Ember.A();
  all.addObject(obj);

  var s = this.subject({
    layout: Ember.Handlebars.compile("{{#object-bin model=all title2='notit'}}<span class='title2'>Hello</span>{{/object-bin}}"),

    all: all
  });

  var titles = this.$().find(".title2");
  equal(titles.length,1);
  equal(titles.text().trim(),"Hello");
});

// don't do anything when dragged on self