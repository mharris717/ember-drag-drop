import Ember from 'ember';
import { test, moduleForComponent} from 'ember-qunit';
//import Coordinator from '../../../models/coordinator';
//import FakeStore from '../../helpers/fake-store';
//import MockDataTransfer from '../../helpers/data-transfer';

moduleForComponent("draggable-object-target", {
  unit: true
});


test("smoke", function(assert) {

  var s = this.subject();
  Ember.run(function() {
    s.set("thing",1);
  });
  assert.equal(s.get('thing'),1);
});
/*
 var randId = function() {
 var res = Math.random() * 500.0;
 return parseInt(res);
 };


these need re-evaluating, do we even need these anymore?

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

var testWithObjects = function(name,f) {
  test(name, function() {
    withTestObjects.call(this,f);
  });
};

test("handlePayload", function(assert) {
  const o = makeTestObjects();
   o.obj.then((obj) => {
    o.obj = obj;
    o.hashId = getCordId(o,obj);

  });

  var s = this.subject({coordinator: o.coordinator, action: "objectDropped"});

  var content = Ember.A();
  var targetObject = {
    objectDropped: function(obj) {
      content.push(obj);
    }
  };
  s.set("targetObject",targetObject);

  s.handlePayload(o.hashId);

  assert.equal(content.length,1);
  assert.equal(content.get('firstObject.id'),o.id,"Expected ID to be "+o.id);

});

if (2 === 2) {
  testWithObjects("handleDrop", function(o, assert) {
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

    assert.equal(content.get('length'),1);
    assert.equal(content.get('firstObject.id'),o.id);
  });

  testWithObjects("pass in content", function(o, assert) {
    var s = this.subject({coordinator: o.coordinator, action: "objectDropped"});

    var content = Ember.A();
    var targetObject = {
      objectDropped: function(obj) {
        content.push(obj);
      }
    };
    s.set("targetObject",targetObject);

    s.handlePayload(o.hashId);

    assert.equal(content.get('length'),1);
    assert.equal(content.get('firstObject.id'),o.id);
    assert.equal(content.length,1);
  });
}*/