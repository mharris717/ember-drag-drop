import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import MockEvent from '../../helpers/mock-event';
import {triggerEvent} from 'ember-native-dom-helpers';
//import startApp from '../../helpers/start-app';
const { $ } = Ember;
//let App;

moduleForComponent('draggable-object', 'Integration | Component | draggable object', {
  integration: true,
//  setup: function() {
//    App = startApp();
//  },
//  teardown: function() {
//    Ember.run(App, 'destroy');
//  }

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

test('Draggable Object is draggable', async function(assert) {
  assert.expect(3);

  //let myObject = {'id':0, data: 'Test Data'};
  let event = new MockEvent();
//  let event = MockDataTransfer.makeMockEvent();

  this.on('dragMoveAction', function(event) {
    assert.ok(event);
  });

  this.render(hbs`
    {{#draggable-object content=myObject class='draggable-object' dragMoveAction=(action "dragMoveAction")}}
      Hi
      <a class="js-dragHandle dragHandle"></a>
    {{/draggable-object}}
  `);
//  let $component = this.$('.draggable-object');
  let componentSelector = '.draggable-object';

//  Ember.run(function() {
   await triggerEvent(componentSelector, 'dragstart', event);
//    triggerEvent($component, 'dragstart', event);
//  });

  assert.equal($(componentSelector).hasClass('is-dragging-object'), true);

//  Ember.run(function() {
    await triggerEvent(componentSelector, 'drag', event);
//    triggerEvent($component, 'drag', event);
//  });

//  Ember.run(function() {
    await triggerEvent(componentSelector, 'dragend', event);
//  });

//  andThen(() => {
    assert.equal($(componentSelector).hasClass('is-dragging-object'), false);
//  });

});

test('Draggable Object is only draggable from handle', async function(assert) {
  assert.expect(6);

  //let myObject = {'id':0, data: 'Test Data'};
  let event = new MockEvent(); // MockDataTransfer.makeMockEvent();

  this.render(hbs`
    {{#draggable-object content=myObject class='draggable-object' dragHandle='.js-dragHandle'}}
      Main Component
      <a class="js-dragHandle dragHandle"></a>
    {{/draggable-object}}
  `);

  //  let $component = this.$('.draggable-object');
  let componentSelector = '.draggable-object';

  //does not drag from main component
//  Ember.run(function() {
   await triggerEvent(componentSelector, 'dragstart', event);
//  });
  assert.equal($(componentSelector).hasClass('is-dragging-object'), false);
  //end drag
//  Ember.run(function() {
  await  triggerEvent(componentSelector, 'dragend', event);
//  });

//  andThen(() => {
    assert.equal($(componentSelector).hasClass('is-dragging-object'), false);
//  });


//  let $handle = this.$('.js-dragHandle');
  //make sure parent element does not have draggable attribute until handle is clicked
  assert.equal($(componentSelector).attr('draggable'), "false");

//  Ember.run(function() {
  await triggerEvent('.js-dragHandle', 'mouseover');
//  });

//  andThen(() => {
    assert.equal($(componentSelector).attr('draggable'), "true");
//  });


  //Drag should start now that the handle is down
//  Ember.run(function() {
  await triggerEvent(componentSelector, 'dragstart', event);
//  });

//  andThen(() => {
    assert.equal($(componentSelector).hasClass('is-dragging-object'), true);
//  });
//
  //Drag has ended draggable attribute should be removed
//  Ember.run(function() {
  await triggerEvent(componentSelector, 'dragend', event);
//  });

  assert.equal($(componentSelector).attr('draggable'), "false");

});

test('Draggable hooks are overridable', async function(assert) {
  assert.expect(2);

  let event = new MockEvent();

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
//  let $component = this.$('.draggable-object');
  let componentSelector = '.draggable-object';
//  Ember.run(function() {
    await triggerEvent(componentSelector , 'dragstart', event);
//  });

//  Ember.run(function() {
  await triggerEvent(componentSelector, 'dragend', event);
//  });
});
