import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SimpleExample extends Controller {
  @tracked dragFinishText = false;
  @tracked dragStartedText = false;
  @tracked dragEndedText = false;
  @tracked myObject = {id: 1, name: 'objectName'};
  
  @action
  dragResult(obj,ops) {
    this.dragFinishText = ops.target.resultText;
    console.log('Content of draggable-object :',obj);
  }

  @action
  dragStart(){
      this.dragEndedText = false;
      this.dragStartedText = 'Drag Has Started';
    }
  @action
    dragEnd() {
      this.dragStartedText = false;
      this.dragEndedText = 'Drag Has Ended';
    }

  @action
  draggingOverTarget() {
    console.log('Over target');
  }

  @action
  leftDragTarget() {
    console.log('Off target');
  }
};

