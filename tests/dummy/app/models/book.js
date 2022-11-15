import Model, { attr, hasMany } from '@ember-data/model';

var Book = Model.extend({
  title: attr('string'),
  pages: hasMany('page', { async: true }),
});

export default Book;
