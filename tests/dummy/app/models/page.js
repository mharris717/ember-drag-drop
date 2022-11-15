import Model, { attr } from '@ember-data/model';

export default class Page extends Model {
  @attr('string') title;
}
