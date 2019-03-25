import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  proxyObject,
  unproxyObject,
} from 'ember-drag-drop/utils/proxy-unproxy-objects';

module(
  'Unit | Util | ember-drag-drop/utils/proxy-unproxy-objects',
  function(hooks) {
    setupTest(hooks);

    hooks.beforeEach(function() {
      this.testObject = {
        value: true,
        id: 123,
      };
    });

    test('proxyObject returns a new object containing content and ID feilds', function testProxyObjAction(assert) {
      assert.expect(2);
      assert.equal(
        proxyObject(this.testObject).content,
        this.testObject,
        'Object contains content field'
      );

      assert.equal(
        proxyObject(this.testObject).id,
        this.testObject.id,
        'Object contains ID field'
      );
    });

    test('unproxyObject returns back the original object', function testUnproxyObjAction(assert) {
      assert.expect(1);
      assert.deepEqual(
        unproxyObject(proxyObject(this.testObject)),
        this.testObject,
        'Object contains original object'
      );
    });
  }
);