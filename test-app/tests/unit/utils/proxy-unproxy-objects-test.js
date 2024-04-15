/* eslint-disable qunit/no-assert-equal, qunit/require-expect */
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  wrapper,
  unwrapper,
} from 'ember-drag-drop/utils/proxy-unproxy-objects';
import { guidFor } from '@ember/object/internals';

module(
  'Unit | Util | ember-drag-drop/utils/proxy-unproxy-objects',
  function (hooks) {
    setupTest(hooks);

    hooks.beforeEach(function () {
      this.testObject = {
        value: true,
        id: 123,
      };
      this.testObjectGuid = guidFor(this.testObject);
    });

    test('wrapper returns a new object containing content and ID feilds', function testProxyObjAction(assert) {
      assert.expect(2);
      assert.equal(
        wrapper(this.testObject)[this.testObjectGuid],
        this.testObject,
        'Wrapped object contains corresponding guid field containing the original object content',
      );

      assert.equal(
        wrapper(this.testObject).id,
        this.testObject.id,
        'Object contains ID field',
      );
    });

    test('unwrapper returns back the original object', function testUnproxyObjAction(assert) {
      assert.expect(1);
      assert.deepEqual(
        unwrapper(wrapper(this.testObject)),
        this.testObject,
        'Returned object is same as the original test object',
      );
    });
  },
);
