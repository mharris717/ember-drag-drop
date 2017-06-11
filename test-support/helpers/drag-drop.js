import {find, triggerEvent} from 'ember-native-dom-helpers';
import MockEvent from './mock-event';

async function dragOver(dropSelector, moves) {
  moves = moves || [[{ clientX: 1, clientY: 1 }, dropSelector]];
  return moves.forEach(async ([position, selector]) => {
    let event = new MockEvent(position);
    await triggerEvent(selector || dropSelector, 'dragover', event);
  });
}

async function drop(dragHandle, dragEvent, options) {
  let { drop: dropSelector, location, dragOverMoves } = options;

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

  return await triggerEvent(dragHandle, 'dragend', location);
}

export async function drag(cssPath, options = {}) {
  let dragEvent = new MockEvent();

  await triggerEvent(cssPath, 'mouseover');

  await triggerEvent(cssPath, 'dragstart', dragEvent);

  if (options.afterDrag) {
    await options.afterDrag.call();
  }

  if (options.drop) {
    await drop(cssPath, dragEvent, options);
  }
}