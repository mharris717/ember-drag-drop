/* global equal */
import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import Coordinator from '../../../models/coordinator';
import FakeStore from '../../helpers/fake-store';
import MockDataTransfer from '../../helpers/data-transfer';

moduleForComponent("draggable-object-target", {
  unit: true
});

var randId = function() {
  var res = Math.random() * 500.0;
  return parseInt(res);
};

test("smoke", function() {
  var s = this.subject();
  Ember.run(function() {
    s.set("thing",1);
  });
  equal(s.get('thing'),1);
});

var getCordId = function(o) {
  var hashId = null;
  Ember.run(function() {
    hashId = o.coordinator.setObject(o.obj);
  });
  return hashId;
};

var makeTestObjects = function() {
  var res = {};

  res.coordinator = Coordinator.create();
  res.store = FakeStore.makeNumberStore(500);
  res.id = randId();
  res.obj = res.store.find('post',res.id);

  return res;
};

var withTestObjects = function(f,testObjects) {
  var o = testObjects || makeTestObjects();
  var me = this;
  o.obj.then(function(obj) {
    o.obj = obj;
    o.hashId = getCordId(o,obj);
    f.call(me,o);
  });
};

var testWithObjects = function(name,f) {
  test(name, function() {
    withTestObjects.call(this,f);
  });
};

testWithObjects("handlePayload", function(o) {
  var s = this.subject({coordinator: o.coordinator, action: "objectDropped"});

  var content = Ember.A();
  var targetObject = {
    objectDropped: function(obj) {
      content.push(obj);
    }
  };
  s.set("targetObject",targetObject);

  s.handlePayload(o.hashId);

  equal(content.length,1);
  equal(content.get('firstObject.id'),o.id,"Expected ID to be "+o.id);
});

// testWithObjects("handlePayload twice", function(o) {
//   var s = this.subject({store: o.store, coordinator: o.coordinator});

//   s.handlePayload(o.hashId);

//   var id2 = randId();

//   QUnit.stop();

//   withTestObjects(function(o2) {
//     s.handlePayload(o2.hashId);
//     setTimeout(function() {
//       QUnit.start();
//     },10);
//   }, {store: o.store, coordinator: o.coordinator, id: id2, obj: o.store.find('post',id2)});

//   equalLength(s.get('content'),2);
//   equal(s.get('content.firstObject.id'),o.id,"First Object ID");
//   equal(s.get('content.lastObject.id'),id2,"Last Object ID");
// });

if (2 === 2) {
  testWithObjects("handleDrop", function(o) {
    var s = this.subject({coordinator: o.coordinator, action: "objectDropped"});

    var content = Ember.A();
    var targetObject = {
      objectDropped: function(obj) {
        content.push(obj);
      }
    };
    s.set("targetObject",targetObject);

    var event = MockDataTransfer.makeMockEvent(o.hashId);

    s.handleDrop(event);

    equal(content.get('length'),1);
    equal(content.get('firstObject.id'),o.id);
  });

  testWithObjects("pass in content", function(o) {
    var s = this.subject({coordinator: o.coordinator, action: "objectDropped"});

    var content = Ember.A();
    var targetObject = {
      objectDropped: function(obj) {
        content.push(obj);
      }
    };
    s.set("targetObject",targetObject);

    s.handlePayload(o.hashId);

    equal(content.get('length'),1);
    equal(content.get('firstObject.id'),o.id);
    equal(content.length,1);
  });
}

// test("template smoke", function() {
//   var all = [1,2,3,4,5];
//   var s = this.subject({content: all});
//   equal(this.$().find(".count").length,1);
//   equal(this.$().find(".count").text(),"5");
// });