import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { drag } from '../../helpers/drag-drop';
import { A } from '@ember/array';
import { w } from '@ember/string';
import $ from 'jquery';

let pojoData = A(
  [
    { id: 1, title: 'Number 1' },
    { id: 2, title: 'Number 2' },
    { id: 3, title: 'Number 3' },
    { id: 4, title: 'Number 4' }
  ]
);

moduleForComponent('sortable-objects', 'Integration | Component | sortable objects', {
  integration: true
});

let visibleNumbers = function(selector = '.sortObject') {
  return $(selector).text().match(/\d/g);
};

let appearsDragging = function(assert, selector, yes = true) {
  let opacity      = yes ? 0.5 : 1,
      condition    = yes ? '' : 'not',
      startMessage = `when item is ${condition} dragging`,
      element      = $(selector);
  assert.equal(element.hasClass('is-dragging-object'), yes, `${startMessage} has class 'is-dragging-object' => ${yes}`);
  assert.equal(element.css('opacity'), opacity, `${startMessage} opacity => ${opacity}`);
};

test('sortable object renders', function(assert) {
  assert.expect(3);

  this.render(hbs`{{sortable-objects}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#sortable-objects}}
      template block text
    {{/sortable-objects}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');

  this.render(hbs`
    {{#sortable-objects}}
     {{#draggable-object class='draggable-object'}}
      Object 1
     {{/draggable-object}}
     {{#draggable-object class='draggable-object'}}
      Object 2
     {{/draggable-object}}
    {{/sortable-objects}}
  `);
  assert.equal(this.$('.draggable-object').length, 2);
});

test('sortable object renders draggable objects', async function(assert) {
  assert.expect(8);

  this.set('pojoData', pojoData);

  this.on('sortEndAction', () => {
    const pojoObj = this.get('pojoData');
    //make sure object items are in the right order
    assert.deepEqual(pojoObj.mapBy('id'), [2, 1, 3, 4], 'after sorting Pojo item list changed')
  });

  this.render(hbs`
    {{#sortable-objects sortableObjectList=pojoData sortEndAction='sortEndAction' class='sortContainer' sortingScope='sortable-objects'}}
      {{#each pojoData as |item|}}
        {{#draggable-object content=item overrideClass='sortObject' isSortable=true sortingScope='sortable-objects'}}
          {{item.title}}
        {{/draggable-object}}
      {{/each}}
    {{/sortable-objects}}
  `);

  assert.equal(this.$('.sortObject').length, 4, 'shows 4 sortable elements');

  let startDragSelector = '.sortObject:nth-child(1)',
      dragOverSelector  = '.sortObject:nth-child(2)';

  const rect = this.$(dragOverSelector)[0].getBoundingClientRect();

  await drag(startDragSelector, {
    drop: dragOverSelector,
    dragOverMoves: [
      [{ clientX: 1, clientY: rect.top }],
      [{ clientX: 1, clientY: rect.top + (rect.height / 2) }]
    ],
    afterDrag() {
      appearsDragging(assert, startDragSelector, true);
    },
    beforeDrop() {
      assert.deepEqual(visibleNumbers(), w('2 1 3 4'), 'After dragging over and before drop items are already shown in correct order');
    }
  });

  appearsDragging(assert, startDragSelector, false);

  assert.deepEqual(visibleNumbers(), w('2 1 3 4'), 'Items are still visually in the correct order after drag end');
});

test('sortable object renders draggable objects using shift algorithm', async function(assert) {

  assert.expect(4);

  this.set('pojoData', pojoData);

  this.on('sortEndAction', () => {
    const pojoObj = this.get('pojoData');
    //make sure object items are in the right order
    assert.deepEqual(pojoObj.mapBy('id'), [2, 3, 1, 4], 'after sorting Pojo item list changed')
  });

  this.render(hbs`
    {{#sortable-objects sortableObjectList=pojoData sortEndAction='sortEndAction' class='sortContainer' useSwap=false}}
      {{#each pojoData as |item|}}
        {{#draggable-object content=item overrideClass='sortObject' isSortable=true}}
          {{item.title}}
        {{/draggable-object}}
      {{/each}}
    {{/sortable-objects}}
  `);

  assert.equal(this.$('.sortObject').length, 4);

  let startDragSelector = '.sortObject:nth-child(1)',
      dragOver2Selector = '.sortObject:nth-child(2)',
      dragOver3Selector = '.sortObject:nth-child(3)';

  const rect2 = this.$(dragOver2Selector)[0].getBoundingClientRect();
  const rect3 = this.$(dragOver3Selector)[0].getBoundingClientRect();

  await drag(startDragSelector, {
    drop: dragOver3Selector,
    dragOverMoves: [
      [{ clientX: 1, clientY: rect2.top }, dragOver2Selector],
      [{ clientX: 1, clientY: rect3.top + (rect3.height / 2) }, dragOver3Selector]
    ],
    beforeDrop() {
      assert.deepEqual(visibleNumbers(), w('2 3 1 4'), 'After dragging over and before drop items are already shown in correct order');
    }
  });

  assert.deepEqual(visibleNumbers(), w('2 3 1 4'), 'items are still shifted after drop');
});


test('sorting does not happen if off', async function(assert) {
  assert.expect(8);

  this.set('pojoData', pojoData);

  // sortEndAction should not be called
  let sortEndActionCalled = false;
  this.on('sortEndAction', function() {
    sortEndActionCalled = true;
  });

  this.render(hbs`
    {{#sortable-objects sortableObjectList=pojoData sortEndAction='sortEndAction' class='sortContainer' enableSort=false}}
      {{#each pojoData as |item|}}
        {{#draggable-object content=item overrideClass='sortObject' isSortable=false}}
          {{item.title}}
        {{/draggable-object}}
      {{/each}}
    {{/sortable-objects}}
  `);

  assert.equal(this.$('.sortObject').length, 4);

  let startDragSelector = '.sortObject:nth-child(1)',
      dragOver2Selector = '.sortObject:nth-child(2)';

  const rect = this.$(dragOver2Selector)[0].getBoundingClientRect();

  await drag(startDragSelector, {
    drop: dragOver2Selector,
    dragOverMoves: [
      [{ clientX: 1, clientY: rect.top }],
      [{ clientX: 1, clientY: rect.top + (rect.height / 2) }]
    ],
    afterDrag() {
      appearsDragging(assert, startDragSelector, true);
    },
    beforeDrop() {
      assert.deepEqual(visibleNumbers(), w('1 2 3 4'), 'Drag over does not affect order');
    }
  });

  //Visual drag items are reset
  appearsDragging(assert, startDragSelector, false);

  //Items are still visually in the start order after drag end
  assert.deepEqual(visibleNumbers(), w('1 2 3 4'), 'Items did not change order after drop');

  assert.equal(sortEndActionCalled, false);
});

test('sort in place', async function(assert) {
  const mutableData = A(pojoData.slice());
  this.set('pojoData', mutableData);

  this.render(hbs`
    {{#sortable-objects sortableObjectList=pojoData class='sortContainer' useSwap=false inPlace=true}}
      {{#each pojoData as |item|}}
        {{#draggable-object content=item overrideClass='sortObject' isSortable=true}}
          {{item.title}}
        {{/draggable-object}}
      {{/each}}
    {{/sortable-objects}}
  `);

  assert.equal(this.$('.sortObject').length, 4);

  let startDragSelector = '.sortObject:nth-child(1)',
    dragOver2Selector = '.sortObject:nth-child(2)',
    dragOver3Selector = '.sortObject:nth-child(3)';

  const rect2 = this.$(dragOver2Selector)[0].getBoundingClientRect();
  const rect3 = this.$(dragOver3Selector)[0].getBoundingClientRect();

  await drag(startDragSelector, {
    drop: dragOver3Selector,
    dragOverMoves: [
      [{ clientX: 1, clientY: rect2.top }, dragOver2Selector],
      [{ clientX: 1, clientY: rect3.top + (rect3.height / 2) }, dragOver3Selector]
    ]
  });

  assert.equal(mutableData, this.get('pojoData'), 'array reference should not change');
  assert.deepEqual(mutableData.mapBy('id'), [2, 3, 1, 4], 'original array should be mutated');
});

//need to test ember data objects
