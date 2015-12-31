import DS from 'ember-data';

var Page = DS.Model.extend({
  title: DS.attr('string')
});

export default Page;