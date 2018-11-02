import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { test, moduleForComponent } from 'ember-qunit';
import Coordinator from '../../../models/coordinator';
import MockEvent from '../../helpers/mock-event';

const Thing = EmberObject.extend({});

moduleForComponent("draggable-object", "DraggableObjectComponent", {
  unit: true,
  needs: ['service:drag-coordinator'], //TODO: this should be an inject as needs will be deprecated
});

test("dragStart", function(assert) {
  let thing       = Thing.create({ id: 1 }),
      coordinator = Coordinator.create(),
      component   = this.subject({ coordinator }),
      target      = document.createElement('div'),
      event       = new MockEvent({target});

  component.set("content", thing);

  run(() => component.dragStart(event));

  let keys   = coordinator.get("objectMap").keys(),
      hashId = A(keys).get("lastObject"),
      data   = event.dataTransfer.data;

  assert.deepEqual(data, { "Text": hashId });
});

test("notified of drop", function(assert) {
  let thing        = Thing.create({ id: 1 }),
      coordinator  = Coordinator.create(),
      props        = { coordinator, content: thing, action: "objectDropped" },
      component    = this.subject(props),
      content      = A(),
      targetObject = {
        objectDropped: function(obj) {
          content.push(obj);
        }
      };

  component.set("target", targetObject);

  let hashId = run(function() {
    return coordinator.setObject(thing, { source: component });
  });

  coordinator.getObject(hashId);
  assert.equal(content.length, 1);
});

test("drop callbacks", function(assert) {
  let thing        = Thing.create({ id: 1 }),
      coordinator  = Coordinator.create(),
      callbackArgs = [];

  coordinator.on("objectMoved", (ops) => callbackArgs.push(ops));

  let component = this.subject({ coordinator });

  let hashId = run(function() {
    return coordinator.setObject(thing, { source: component });
  });

  coordinator.getObject(hashId);

  assert.equal(callbackArgs.length, 1);
  assert.equal(callbackArgs[0].obj.get('id'), 1);
});

test("dragStartHook", function(assert) {
  assert.expect(1);
  let thing       = Thing.create({ id: 1 }),
      coordinator = Coordinator.create(),
      component   = this.subject({ coordinator }),
      event       = new MockEvent();

  component.set("content", thing);

  component.dragStartHook = () => assert.ok(true);

  run(() => component.dragStart(event));
});

test("dragEndHook", function(assert) {
  assert.expect(1);
  let thing       = Thing.create({ id: 1 }),
      coordinator = Coordinator.create(),
      component   = this.subject({ coordinator }),
      event       = new MockEvent();

  component.set("content", thing);
  component.set("isDraggingObject", true);

  component.dragEndHook = () => assert.ok(true);

  run(() => component.dragEnd(event));
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
