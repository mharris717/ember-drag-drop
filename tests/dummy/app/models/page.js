import Model, { attr } from '@ember-data/model';

var Page = Model.extend({
  title: attr('string'),
});

export default Page;
