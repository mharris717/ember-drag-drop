import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SortExample extends Controller {
  sortFinishText = null;

  @action
  dragStart(object) {
    console.log('Drag Start', object);
  }
  @action
  sortEndAction() {
    console.log('Sort Ended', this.get('model.pages'));
  }
}
