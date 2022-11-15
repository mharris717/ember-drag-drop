import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SortExample extends Controller {
  sortFinishText = null;

  @action
  dragStart(object) {
    console.log('Drag Start', object);
  }
  @action
  async sortEndAction() {
    console.log('Sort Ended', await this.model.pages);
  }
}
