import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import MockDataTransfer from '../../helpers/data-transfer';
import startApp from '../../helpers/start-app';

let App;
let pojoData = Ember.A(
  [{id: 1, title:'Number 1'},
    {id: 2, title:'Number 2'},
    {id: 3, title:'Number 3'},
    {id: 4, title:'Number 4'}]
);

moduleForComponent('sortable-objects', 'Integration | Component | sortable objects', {
  integration: true,
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

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
  assert.equal(this.$('.draggable-object').size(), 2);
});

test('sortable object renders draggable objects', function(assert) {
  const self = this;
  let event = MockDataTransfer.makeMockEvent();
  assert.expect(17);

  this.set('pojoData', pojoData);
  this.on('sortEndAction', function() {
    const pojoObj = self.get('pojoData');
    //make sure object is in the right order
    assert.equal(pojoObj[0].id, 2);
    assert.equal(pojoObj[1].id, 1);
    assert.equal(pojoObj[2].id, 3);
    assert.equal(pojoObj[3].id, 4);

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

  assert.equal(this.$('.sortObject').size(), 4);

  let $component = this.$('.sortObject');
  let $container = this.$('.sortContainer');

  //Starts drag as usual
  //set fake positions
  event.originalEvent.clientX = 1;
  event.originalEvent.clientY = 1;
  Ember.run(function() {
    triggerEvent($component, 'dragstart', event);
  });
  andThen(function() {
    assert.equal($component.hasClass('is-dragging-object'), true);
    //item is faded while dragging
    assert.equal($component.css('opacity'), '0.5');
  });

  Ember.run(function() {
    let event = MockDataTransfer.makeMockEvent();
    event.originalEvent.clientX = 1;
    event.originalEvent.clientY = 500;
    triggerEvent($component.get(1), 'dragover', event);
  });
  Ember.run(function() {
    let event = MockDataTransfer.makeMockEvent();
    event.originalEvent.clientX = 1;
    event.originalEvent.clientY = 501;
    triggerEvent($component.get(1), 'dragover', event);
  });
  andThen(function() {
    //Drag over shows swapped items correctly
    let $components = self.$('.sortObject');
    assert.equal(self.$($components.get(0)).text().trim(), 'Number 2');
    assert.equal(self.$($components.get(1)).text().trim(), 'Number 1');
    assert.equal(self.$($components.get(2)).text().trim(), 'Number 3');
    assert.equal(self.$($components.get(3)).text().trim(), 'Number 4');
  });
  Ember.run(function() {
    triggerEvent($component, 'dragend', event);
    triggerEvent($container, 'dragend', event);
    triggerEvent($container, 'drop', event);
  });
  andThen(function() {
    //Visual drag items are reset
    assert.equal($component.hasClass('is-dragging-object'), false);
    assert.equal($component.css('opacity'), '1');
  });
  andThen(function() {
    //Items are still visually in the correct order after drag end
    let $components = self.$('.sortObject');
    assert.equal(self.$($components.get(0)).text().trim(), 'Number 2');
    assert.equal(self.$($components.get(1)).text().trim(), 'Number 1');
    assert.equal(self.$($components.get(2)).text().trim(), 'Number 3');
    assert.equal(self.$($components.get(3)).text().trim(), 'Number 4');
  });

});


test('sorting does not happen if off', function(assert) {
  const self = this;
  let event = MockDataTransfer.makeMockEvent();
  assert.expect(14);

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

  assert.equal(this.$('.sortObject').size(), 4);

  let $component = this.$('.sortObject');
  let $container = this.$('.sortContainer');

  //Starts drag as usual
  //set fake positions
  event.originalEvent.clientX = 1;
  event.originalEvent.clientY = 1;
  Ember.run(function() {
    triggerEvent($component, 'dragstart', event);
  });
  andThen(function() {
    assert.equal($component.hasClass('is-dragging-object'), true);
    //item is faded while dragging
    assert.equal($component.css('opacity'), '0.5');
  });

  Ember.run(function() {
    let event = MockDataTransfer.makeMockEvent();
    event.originalEvent.clientX = 1;
    event.originalEvent.clientY = 500;
    triggerEvent($component.get(1), 'dragover', event);
  });
  Ember.run(function() {
    let event = MockDataTransfer.makeMockEvent();
    event.originalEvent.clientX = 1;
    event.originalEvent.clientY = 501;
    triggerEvent($component.get(1), 'dragover', event);
  });
  andThen(function() {
    //Drag over does not affect order
    let $components = self.$('.sortObject');
    assert.equal(self.$($components.get(0)).text().trim(), 'Number 1');
    assert.equal(self.$($components.get(1)).text().trim(), 'Number 2');
    assert.equal(self.$($components.get(2)).text().trim(), 'Number 3');
    assert.equal(self.$($components.get(3)).text().trim(), 'Number 4');
  });
  Ember.run(function() {
    triggerEvent($component, 'dragend', event);
    triggerEvent($container, 'dragend', event);
    triggerEvent($container, 'drop', event);
  });
  andThen(function() {
    //Visual drag items are reset
    assert.equal($component.hasClass('is-dragging-object'), false);
    assert.equal($component.css('opacity'), '1');
  });
  andThen(function() {
    //Items are still visually in the correct order after drag end
    let $components = self.$('.sortObject');
    assert.equal(self.$($components.get(0)).text().trim(), 'Number 1');
    assert.equal(self.$($components.get(1)).text().trim(), 'Number 2');
    assert.equal(self.$($components.get(2)).text().trim(), 'Number 3');
    assert.equal(self.$($components.get(3)).text().trim(), 'Number 4');
  });
  andThen(function() {
    assert.equal(sortEndActionCalled, false);
  });
});
//need to test ember data objects
