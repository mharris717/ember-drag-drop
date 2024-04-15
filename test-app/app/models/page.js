/* eslint-disable ember/no-classic-classes, ember/use-ember-data-rfc-395-imports */
import DS from 'ember-data';

var Page = DS.Model.extend({
  title: DS.attr('string'),
});

export default Page;
