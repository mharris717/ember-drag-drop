import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

moduleForComponent('object-bin', 'Integration | Component | object bin', {
  integration: true
});

test("component on fly 2", function(assert) {
  let obj = EmberObject.create({ title2: "Hello" }),
      all = A();
  all.addObject(obj);

  this.set('all', all);

  this.render(hbs`{{#object-bin title2='notit' model=all as |obj|}}<span class='title2'>{{obj.title2}}</span>{{/object-bin}}`);

  let titles = this.$().find(".title2");

  assert.equal(titles.length, 1);
  assert.equal(titles.text().trim(), "Hello");
});
