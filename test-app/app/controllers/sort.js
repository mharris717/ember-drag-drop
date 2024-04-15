import Controller from '@ember/controller';
import { action } from '@ember/object';
import { A } from '@ember/array';


export default class SortExample extends Controller {

  sortFinishText = null;
  sortableObjectList = A([
    {id: 1, title:'Number 1'},
    {id: 2, title:'Number 2'},
    {id: 3, title:'Number 3'},
    {id: 4, title:'Number 4'}
  ])
  
  sortableObjectList2 = A([
    {id: 1, title:'Number 5'},
    {id: 2, title:'Number 6'},
    {id: 3, title:'Number 7'},
    {id: 4, title:'Number 8'}
    ])

  @action
  sortEndAction() {
    console.log('Sort Ended', this.get('sortableObjectList'));
  }
  @action
  sortEndAction2() {
      console.log('Sort Ended on second list', this.get('sortableObjectList2'));
    }
}
