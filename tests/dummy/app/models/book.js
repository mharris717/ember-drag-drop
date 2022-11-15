import Model, { attr, hasMany } from '@ember-data/model';

export default class Book extends Model {
  @attr('string') title;
  @hasMany('page', { async: true }) pages;
}
