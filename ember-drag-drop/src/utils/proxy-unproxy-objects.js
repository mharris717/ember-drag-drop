/* eslint-disable prettier/prettier */
import { isNone } from '@ember/utils';
import { guidFor } from '@ember/object/internals';

/**
 * On drag action we need to provide a property `isDraggingObject` to the UI.
 * This utility is used to create a wrapper object around the object passed to the proxy function.
 * We use this wrapper to prevent the `draggable-object` from mutating the original object by appending
 * `isDraggingObject` to the content.
 * 
 * This unexpected mutation causes problems when the targeted content is not prepared to handle
 * the additional property, and potentially leaks local state onto an object that likely holds state
 * for the route or application more generally.
 */

/**
 * @access public
 * Returns the passed object wrapped within new object.
 * Used to proxy draggable objects.
 * @param objectToProxy Object to proxy.
 * @returns {Object} Proxy object.
 */
export function wrapper(objectToProxy) {
  // If we do not have any content for the object to proxy, 
  // we do not wish to render that item.
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
