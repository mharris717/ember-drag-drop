import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import Coordinator from '../../../models/coordinator';
import MockDataTransfer from '../../helpers/data-transfer';

var Thing = Ember.Object.extend({});

moduleForComponent("draggable-object","DraggableObjectComponent", {
  needs: ['service:drag-coordinator'], //TODO: this should be an inject as needs will be deprecated
  unit: true
});

test("dragStart", function(assert) {
  var thing = Thing.create({id: 1});
  var coordinator = Coordinator.create();

  var s = this.subject({coordinator: coordinator});
  s.set("content",thing);

  var event = MockDataTransfer.makeMockEvent();
  Ember.run(function() {
    s.dragStart(event);
  });

  var keys = coordinator.get("objectMap").keys();
  var hashId = Ember.A(keys).get("lastObject");

  var data = event.dataTransfer.get('data');
  assert.equal(data.dataType,"Text");
  assert.equal(data.payload,hashId);
});

test("notified of drop", function(assert) {
  var thing = Thing.create({id: 1});
  var coordinator = Coordinator.create();

  var s = this.subject({coordinator: coordinator, content: thing, action: "objectDropped"});

  var content = Ember.A();
  var targetObject = {
    objectDropped: function(obj) {
      content.push(obj);
    }
  };
  s.set("targetObject",targetObject);

  var hashId = Ember.run(function() {
    return coordinator.setObject(thing, {source: s});
  });

  coordinator.getObject(hashId);
  assert.equal(content.length,1);
});

test("drop callbacks", function(assert) {
  var thing = Thing.create({id: 1});
  var coordinator = Coordinator.create();

  var callbackArgs = [];
  coordinator.on("objectMoved", function(ops) {
    callbackArgs.push(ops);
  });

  var s = this.subject({coordinator: coordinator});

  var hashId = Ember.run(function() {
    return coordinator.setObject(thing, {source: s});
  });

  coordinator.getObject(hashId);

  assert.equal(callbackArgs.length,1);
  assert.equal(callbackArgs[0].obj.get('id'),1);
});

// test("sim drag", function() {
//   var thing = Thing.create({id: 1});
//   var coordinator = Coordinator.create();
//   var s = this.subject({coordinator: coordinator, content: thing});

//   this.append();

//   equal(find(".draggable-object").length,1,"Expected .draggable-span count of 1");

//   var draggable = find(".draggable-object")[0];

//   var event = MockDataTransfer.createDomEvent("dragstart");
//   draggable.dispatchEvent(event);

//   equal(coordinator.get("objectMap.length"),1);
// });

// test("template smoke", function() {
//   var s = this.subject();
//   equal(this.$().find(".thing").length,1);
// });