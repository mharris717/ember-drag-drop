import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SimpleExample extends Controller {
  @tracked useSwap = true;
  sortFinishText = null;
  sortableObjectList = A([
    { id: 1, title: 'Number 1' },
    { id: 2, title: 'Number 2' },
    { id: 3, title: 'Number 3' },
    { id: 4, title: 'Number 4' },
    { id: 5, title: 'Number 5' },
    { id: 6, title: 'Number 6' },
    { id: 7, title: 'Number 7' },
    { id: 8, title: 'Number 8' },
  ]);

  @action
  sortEndAction() {
    console.log('Sort Ended', this.sortableObjectList);
  }
}
