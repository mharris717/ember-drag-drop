import { triggerEvent, find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import MockEvent from '../../helpers/mock-event';

module('Integration | Component | draggable object', function(hooks){
  setupRenderingTest(hooks);

  test('draggable object renders', async function(assert) {
    assert.expect(2);
  
    await render(hbs`{{draggable-object}}`);

    assert.equal(this.element.innerText.trim(), '');
  
    await render(hbs`
      {{#draggable-object}}
        template block text
      {{/draggable-object}}
    `);

    assert.equal(this.element.innerText.trim(), 'template block text');
  });
  
  test('Draggable Object is draggable', async function(assert) {
    assert.expect(3);
  
    let event = new MockEvent();
  
    this.set('dragMoveAction', (event) => assert.ok(event));
  
    await render(hbs`
      {{#draggable-object content=myObject class='draggable-object' dragMoveAction=(action dragMoveAction)}}
        Hi
        <a class="js-dragHandle dragHandle"></a>
      {{/draggable-object}}
    `);
  
    let componentSelector = '.draggable-object';
  
    await triggerEvent(componentSelector, 'dragstart', event);
  
    assert.equal(find(componentSelector).classList.contains('is-dragging-object'), true);
  
    await triggerEvent(componentSelector, 'drag', event);
  
    await triggerEvent(componentSelector, 'dragend', event);
  
    assert.equal(find(componentSelector).classList.contains('is-dragging-object'), false);
  
  });
  
  test('Draggable Object is only draggable from handle', async function(assert) {
    assert.expect(6);
  
    let event = new MockEvent();
  
    await render(hbs`
      {{#draggable-object content=myObject class='draggable-object' dragHandle='.js-dragHandle'}}
        Main Component
        <a class="js-dragHandle dragHandle"></a>
      {{/draggable-object}}
    `);
  
    let componentSelector = '.draggable-object';
  
    //does not drag from main component
    await triggerEvent(componentSelector, 'dragstart', event);
    assert.equal(find(componentSelector).classList.contains('is-dragging-object'), false);
  
    //end drag
    await  triggerEvent(componentSelector, 'dragend', event);
  
    assert.equal(find(componentSelector).classList.contains('is-dragging-object'), false);
  
    //make sure parent element does not have draggable attribute until handle is clicked
    assert.equal(find(componentSelector).getAttribute('draggable'), "false");
  
    await triggerEvent('.js-dragHandle', 'mouseover');
  
    assert.equal(find(componentSelector).getAttribute('draggable'), "true");
  
    //Drag should start now that the handle is down
    await triggerEvent(componentSelector, 'dragstart', event);
  
    assert.equal(find(componentSelector).classList.contains('is-dragging-object'), true);
  
    //Drag has ended draggable attribute should be removed
    await triggerEvent(componentSelector, 'dragend', event);
  
    assert.equal(find(componentSelector).getAttribute('draggable'), "false");
  
  });
  
  test('Draggable hooks are overridable', async function(assert) {
    assert.expect(2);
  
    let event = new MockEvent();
  
    this.set('dragStartAction', (event) => assert.ok(event));
  
    this.set('dragEndAction', (event) => assert.ok(event));
  
    await render(hbs`
      {{#draggable-object class='draggable-object' dragStartHook=(action dragStartAction) dragEndHook=(action dragEndAction)}}
      {{/draggable-object}}
    `);
  
    let componentSelector = '.draggable-object';
  
    await triggerEvent(componentSelector, 'dragstart', event);
  
    await triggerEvent(componentSelector, 'dragend', event);
  });
});
