import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { render, find, findAll } from '@ember/test-helpers';

module('Integration | Component | object bin', function(hooks) {
  setupRenderingTest(hooks);

  test("component on fly 2", async function(assert) {
    let obj = EmberObject.create({ title2: "Hello" }),
        all = A();
    all.addObject(obj);

    this.set('all', all);

    await render(hbs`{{#object-bin title2='notit' model=all as |obj|}}<span class='title2'>{{obj.title2}}</span>{{/object-bin}}`);

    assert.equal(findAll('.title2').length, 1);
    assert.equal(find('.title2').textContent.trim(), "Hello");
  });
});
