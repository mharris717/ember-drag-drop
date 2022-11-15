import { module, test } from 'qunit';
import * as oldDragDrop from 'dummy/tests/helpers/drag-drop';
import * as oldDataTransfer from 'dummy/tests/helpers/data-transfer';
import * as oldMockEvent from 'dummy/tests/helpers/mock-event';

import * as newDragDrop from 'ember-drag-drop/test-support/helpers/drag-drop';
import * as newDataTransfer from 'ember-drag-drop/test-support/helpers/data-transfer';
import * as newMockEvent from 'ember-drag-drop/test-support/helpers/mock-event';

module('test-support exports', function () {
  test('helpers/drag-drop', function (assert) {
    assert.expect(2);
    for (const [key, value] of Object.entries(oldDragDrop)) {
      assert.deepEqual(value, newDragDrop[key]);
    }
  });

  test('helpers/data-transfer', function (assert) {
    assert.expect(1);
    for (const [key, value] of Object.entries(oldDataTransfer)) {
      assert.deepEqual(value, newDataTransfer[key]);
    }
  });

  test('helpers/mock-event', function (assert) {
    assert.expect(2);
    for (const [key, value] of Object.entries(oldMockEvent)) {
      assert.deepEqual(value, newMockEvent[key]);
    }
  });
});
