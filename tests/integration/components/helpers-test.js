import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startApp from '../../helpers/start-app';
import Coordinator from '../../../models/coordinator';
import { drag } from '../../helpers/ember-drag-drop';

let App;

moduleForComponent('ember-drag-drop', 'Integration | Helpers', {
  integration: true,
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }

});

const collection = ['hip hop', 'jazz', 'funk'];
const template = hbs`
  {{#each collection as |genre index|}}
    {{#draggable-object coordinator=coordinator content=genre}}
      <div class="item">{{genre}}</div>
    {{/draggable-object}}

    {{draggable-object-target class='drop-target' action=dropAction destination=index coordinator=coordinator}}
  {{/each}}
`;

test('drag helper drags to a draggable object target and calls the action upon drop', function(assert) {
  assert.expect(2);

  let coordinator = Coordinator.create();

  coordinator.on('objectMoved', function(ops) {
    assert.equal(ops.obj, 'hip hop');
    assert.equal(ops.target.destination, 1);
  });

  this.set('collection', collection);
  this.set('coordinator', coordinator);
  this.render(template);

  drag('.draggable-object:contains("hip hop")', {
    drop: '.drop-target:eq(1)'
  });
});

test('drag helper allows a callback to be called before dropping', function(assert) {
  assert.expect(3);

  let coordinator = Coordinator.create();

  coordinator.on('objectMoved', function(ops) {
    assert.equal(ops.obj, 'jazz');
    assert.equal(ops.target.destination, 2);
  });

  this.set('collection', collection);
  this.set('coordinator', coordinator);
  this.render(template);

  drag('.draggable-object:contains("jazz")', {
    drop: '.drop-target:eq(2)',
    beforeDrop: function() {
      assert.ok($('.is-dragging-object.draggable-object:contains("jazz")'));
    }
  });
});
