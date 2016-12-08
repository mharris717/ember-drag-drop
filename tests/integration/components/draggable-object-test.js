import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import MockDataTransfer from '../../helpers/data-transfer';
import startApp from '../../helpers/start-app';

let App;

moduleForComponent('draggable-object', 'Integration | Component | draggable object', {
  integration: true,
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }

});

test('draggable object renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{draggable-object}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#draggable-object}}
      template block text
    {{/draggable-object}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('Draggable Object is draggable', function(assert) {
  assert.expect(3);

  //let myObject = {'id':0, data: 'Test Data'};
  let event = MockDataTransfer.makeMockEvent();

  this.on('dragMoveAction', function(event) {
    assert.ok(event);
  });
  this.render(hbs`
    {{#draggable-object content=myObject class='draggable-object' dragMoveAction=(action "dragMoveAction")}}
      Hi
      <a class="js-dragHandle dragHandle"></a>
    {{/draggable-object}}
  `);
  let $component = this.$('.draggable-object');


  Ember.run(function() {
    triggerEvent($component, 'dragstart', event);
  });

  assert.equal($component.hasClass('is-dragging-object'), true);

  Ember.run(function() {
    triggerEvent($component, 'drag', event);
  });

  Ember.run(function() {
    triggerEvent($component, 'dragend', event);
  });

  assert.equal($component.hasClass('is-dragging-object'), false);
});

test('Draggable Object is only draggable from handle', function(assert) {
  assert.expect(6);

  //let myObject = {'id':0, data: 'Test Data'};
  let event = MockDataTransfer.makeMockEvent();

  this.render(hbs`
    {{#draggable-object content=myObject class='draggable-object' dragHandle='.js-dragHandle'}}
      Main Component
      <a class="js-dragHandle dragHandle"></a>
    {{/draggable-object}}
  `);
  let $component = this.$('.draggable-object');

  //does not drag from main component
  Ember.run(function() {
    triggerEvent($component, 'dragstart', event);
  });
  assert.equal($component.hasClass('is-dragging-object'), false);
  //end drag
  Ember.run(function() {
    triggerEvent($component, 'dragend', event);
  });

  assert.equal($component.hasClass('is-dragging-object'), false);

  let $handle = this.$('.js-dragHandle');
  //make sure parent element does not have draggable attribute until handle is clicked
  assert.equal($component.attr('draggable'), "false");

  Ember.run(function() {
    triggerEvent($handle, 'mouseover');
  });

  assert.equal($component.attr('draggable'), "true");

  //Drag should start now that the handle is down
  Ember.run(function() {
    triggerEvent($component, 'dragstart', event);
  });

  assert.equal($component.hasClass('is-dragging-object'), true);

  //Drag has ended draggable attribute should be removed
  Ember.run(function() {
    triggerEvent($component, 'dragend', event);
  });

  assert.equal($component.attr('draggable'), "false");

});

test('Draggable hooks are overridable', function(assert) {
  assert.expect(2);

  let event = MockDataTransfer.makeMockEvent();

  this.on('dragStartAction', function(event) {
    assert.ok(event);
  });

  this.on('dragEndAction', function(event) {
    assert.ok(event);
  });

  this.render(hbs`
    {{#draggable-object class='draggable-object' dragStartHook=(action 'dragStartAction') dragEndHook=(action 'dragEndAction')}}
    {{/draggable-object}}
  `);
  let $component = this.$('.draggable-object');

  Ember.run(function() {
    triggerEvent($component, 'dragstart', event);
  });

  Ember.run(function() {
    triggerEvent($component, 'dragend', event);
  });
});
