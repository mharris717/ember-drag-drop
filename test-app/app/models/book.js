/* eslint-disable ember/no-classic-classes, ember/use-ember-data-rfc-395-imports */
import DS from 'ember-data';

var Book = DS.Model.extend({
  title: DS.attr('string'),
  pages: DS.hasMany('page', { async: true, inverse: null }),
});

export default Book;
