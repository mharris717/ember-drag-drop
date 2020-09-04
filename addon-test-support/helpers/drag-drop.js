import {find, triggerEvent} from '@ember/test-helpers';
import MockEvent from './mock-event';

async function dragOver(dropSelector, moves) {
  moves = moves || [[{ clientX: 1, clientY: 1 }, dropSelector]];
  
  for (const move of moves) {
    const position = move[0] || false;
    const selector = move[1] || false;
    const event = new MockEvent(position);
    await triggerEvent(selector || dropSelector, 'dragover', event);
  }
}

async function drop(dragElement, dragEvent, options) {
  let { drop: dropSelector, dropEndOptions, dragOverMoves } = options;

  let dropElement = await find(dropSelector);
  if (!dropElement) {
    throw(`There are no drop targets by the given selector: '${dropSelector}'`);
  }

  await dragOver(dropSelector, dragOverMoves);

  if (options.beforeDrop) {
    await options.beforeDrop.call();
  }

  let event = new MockEvent().useDataTransferData(dragEvent);
  await triggerEvent(dropSelector, 'drop', event);

  return await triggerEvent(dragElement, 'dragend', dropEndOptions);
}

export async function drag(dragSelector, options = {}) {
  let dragEvent = new MockEvent(options.dragStartOptions);
  const dragElement = document.querySelector(dragSelector);

  await triggerEvent(dragSelector, 'mouseover');

  await triggerEvent(dragSelector, 'dragstart', dragEvent);

  if (options.afterDrag) {
    await options.afterDrag.call();
  }

  if (options.drop) {
    await drop(dragElement, dragEvent, options);
  }
}