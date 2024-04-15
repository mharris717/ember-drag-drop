/* eslint-disable ember/classic-decorator-no-classic-methods, ember/no-get */
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SortExample extends Controller {
  sortFinishText = null;

  get pages() {
    return Array.from(this.model.pages);
  }

  @action
  dragStart(object) {
    console.log('Drag Start', object);
  }
  @action
  sortEndAction() {
    console.log('Sort Ended', this.get('model.pages'));
  }
}
