import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import MockEvent from '../../helpers/mock-event';
import { triggerEvent } from 'ember-native-dom-helpers';

import $ from 'jquery';

moduleForComponent('draggable-object', 'Integration | Component | draggable object', {
  integration: true,
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

  let event = new MockEvent();

  this.on('dragMoveAction', (event) => assert.ok(event));

  this.render(hbs`
    {{#draggable-object content=myObject class='draggable-object' dragMoveAction=(action 'dragMoveAction')}}
      Hi
      <a class="js-dragHandle dragHandle"></a>
    {{/draggable-object}}
  `);

  let componentSelector = '.draggable-object';

  await triggerEvent(componentSelector, 'dragstart', event);

  assert.equal($(componentSelector).hasClass('is-dragging-object'), true);

  await triggerEvent(componentSelector, 'drag', event);

  await triggerEvent(componentSelector, 'dragend', event);

  assert.equal($(componentSelector).hasClass('is-dragging-object'), false);

});

test('Draggable Object is only draggable from handle', async function(assert) {
  assert.expect(6);

  let event = new MockEvent();

  this.render(hbs`
    {{#draggable-object content=myObject class='draggable-object' dragHandle='.js-dragHandle'}}
      Main Component
      <a class="js-dragHandle dragHandle"></a>
    {{/draggable-object}}
  `);

  let componentSelector = '.draggable-object';

  //does not drag from main component
  await triggerEvent(componentSelector, 'dragstart', event);
  assert.equal($(componentSelector).hasClass('is-dragging-object'), false);

  //end drag
  await  triggerEvent(componentSelector, 'dragend', event);

  assert.equal($(componentSelector).hasClass('is-dragging-object'), false);

  //make sure parent element does not have draggable attribute until handle is clicked
  assert.equal($(componentSelector).attr('draggable'), "false");

  await triggerEvent('.js-dragHandle', 'mouseover');

  assert.equal($(componentSelector).attr('draggable'), "true");

  //Drag should start now that the handle is down
  await triggerEvent(componentSelector, 'dragstart', event);

  assert.equal($(componentSelector).hasClass('is-dragging-object'), true);

  //Drag has ended draggable attribute should be removed
  await triggerEvent(componentSelector, 'dragend', event);

  assert.equal($(componentSelector).attr('draggable'), "false");

});

test('Draggable hooks are overridable', async function(assert) {
  assert.expect(2);

  let event = new MockEvent();

  this.on('dragStartAction', (event) => assert.ok(event));

  this.on('dragEndAction', (event) => assert.ok(event));

  this.render(hbs`
    {{#draggable-object class='draggable-object' dragStartHook=(action 'dragStartAction') dragEndHook=(action 'dragEndAction')}}
    {{/draggable-object}}
  `);

  let componentSelector = '.draggable-object';

  await triggerEvent(componentSelector, 'dragstart', event);

  await triggerEvent(componentSelector, 'dragend', event);
});
