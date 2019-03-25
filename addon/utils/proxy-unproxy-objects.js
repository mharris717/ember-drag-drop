import { isNone } from '@ember/utils';
/**
 * This utility is ussed to create a wrapper object around the object passed to the proxy function.
 * Currently on drag action, the `draggable-object` mutates the `content` object and appends a new
 * property `isDraggingObject` onto the parent object.
 * This behavior throws an exception with M3 models because it not a previously whitelisted property. The issue
 * is being tracked (ticket: TODO: Add Github issue ticket here).
 *
 * This utility is used to create a proxy object to wrap the original `content` M3 objet to 
 * avoud any exceptions from being thrown when dragging is initiated on the object.
 * 
 * Note: Added further implementation to `unproxyObject` that can be used to unproxy the previously
 * proxies object thereby returning the original M3 object.
 *
 */

/**
 * @access public
 * Returns the passed object wrapped within new object.
 * Used to proxy draggable objects.
 * @param objectToProxy Object to proxy.
 * @returns {Object} Proxy object.
 */
export function proxyObject(objectToProxy) {
  if (!isNone(objectToProxy)) {
    return {
      content: objectToProxy,
      id: objectToProxy.id,
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
export function unproxyObject(objectToUnproxy) {
  if (!isNone(objectToUnproxy)) {
    return objectToUnproxy.content;
  }
  return null;
}
