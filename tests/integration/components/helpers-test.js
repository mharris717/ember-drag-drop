import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Coordinator from '../../../models/coordinator';
import { drag } from '../../helpers/drag-drop';
import { find, render } from '@ember/test-helpers';

module('Integration | Helpers', function(hooks) {
  setupRenderingTest(hooks);

  const collection = ['hiphop', 'jazz', 'funk'];
  const template = hbs`
    {{#each collection as |genre index|}}
      {{#draggable-object classNames=genre coordinator=coordinator content=genre}}
        <div class="item">{{genre}}</div>
      {{/draggable-object}}

      {{draggable-object-target classNames=genre class='drop-target' action=(action dropAction) destination=index coordinator=coordinator}}
    {{/each}}
  `;

  test('drag helper drags to a draggable object target and calls the action upon drop', async function(assert) {
    assert.expect(3);

    let coordinator = Coordinator.create();

    coordinator.on('objectMoved', function(ops) {
      assert.equal(ops.obj, 'hiphop');
      assert.equal(ops.target.destination, 1);
    });

    this.set('collection', collection);
    this.set('coordinator', coordinator);
    this.set('dropAction', () => {
      assert.ok(true, 'called drop action');
    })

    await render(template);

    await drag('.draggable-object.hiphop', { drop: '.drop-target.jazz' });
  });

  test('drag helper allows a callback to be called before dropping', async function(assert) {
    assert.expect(3);

    let coordinator = Coordinator.create();

    coordinator.on('objectMoved', function(ops) {
      assert.equal(ops.obj, 'jazz');
      assert.equal(ops.target.destination, 2);
    });

    this.set('collection', collection);
    this.set('coordinator', coordinator);
    this.set('dropAction', () => {});
    await render(template);

    await drag('.draggable-object.jazz', {
      drop: '.drop-target.funk',
      beforeDrop() {
        assert.ok(find('.is-dragging-object.draggable-object.jazz'))
      }
    });

  });

});

