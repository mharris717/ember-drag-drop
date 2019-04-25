import { isNone } from '@ember/utils';
import { guidFor } from '@ember/object/internals';

/**
 * This utility is used to create a wrapper object around the object passed to the proxy function.
 * Currently on drag action, the `draggable-object` mutates the `content` object and appends a new
 * property `isDraggingObject` onto the parent object.
 * 
 * This unexpected mutation causes problems when the targeted content is not prepared to handle
 * the additional property, and potentially leaks local state onto an object that likely holds state
 * for the route or application more generally.
 *
 * This utility is used to create a proxy object to wrap the original object to avoid any exceptions
 * from being thrown when dragging action is initiated on the draggable object.
 * 
 * Note: Added further implementation to `unwrapper` that can be used to unproxy the previously
 * proxied object thereby returning the original object content.
 *
 */

/**
 * @access public
 * Returns the passed object wrapped within new object.
 * Used to proxy draggable objects.
 * @param objectToProxy Object to proxy.
 * @returns {Object} Proxy object.
 */
export function wrapper(objectToProxy) {
  if (!isNone(objectToProxy)) {
    const guidKey = guidFor(objectToProxy);
    return {
      [guidKey]: objectToProxy,
      unwrappingKey: guidKey,
      id: objectToProxy.id
    };
  }
  return null;
}

/**
 * @access public
 * Returns the content of the passed object.
 * Used to un-proxy draggable objects.
 * @param objectToUnproxy Object to un-proxy.
 * @returns {Object} Content of the proxy object.
 */
export function unwrapper(objectToUnproxy) {
  if (!isNone(objectToUnproxy)) {
    return objectToUnproxy[objectToUnproxy.unwrappingKey];
  }
  return null;
}
