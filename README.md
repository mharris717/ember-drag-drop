# Ember Drag Drop

[![Build Status](https://travis-ci.org/mharris717/ember-drag-drop.svg?branch=master)](https://travis-ci.org/mharris717/ember-drag-drop)

Simple drag and drop addon for your Ember CLI app.

The goal is to allow you to add drag and drop to your app without having to become an expert in the browser's low level D&D API.

To use this addon, you don't need to:

* Know anything about how the browser implements drag and drop.
* Ever deal with a browser drag and drop event, or even know that they exist.

When using this addon, you get to work with objects in your domain layer, just like everywhere else in Ember. The only two things you need to use are (as you might expect) [Draggable Object](#draggable-object) and [Draggable Object Target](#draggable-object-target)

## Requirements

- ember-cli 0.2.7 or higher (may work with lower version, but this is what is tested)
- If you use the sorting object, you will need Ember 1.13.2 or higher.

## Installation

```
ember install ember-drag-drop
```

## Thanks

Huge thanks to [ic-droppable](https://github.com/instructure/ic-droppable), from which I shamelessly stole as promised.

<!--- START GENERATED DOCS -->

# Usage



#### Primitives

* [Draggable Object](#draggable-object)
* [Draggable Object Target](#draggable-object-target)
* [Sortable Objects](#sorting-of-objects)

#### Examples

* [Live simple demos](http://mharris717.github.io/ember-drag-drop/)
* [Classify Posts](#classify-posts)

## Mobile and touch events

As of version 0.4.4 you can install the [ember-drag-drop-polyfill](https://github.com/aboveproperty/ember-drag-drop-polyfill) to enable drag and drop actions on mobile devices.  It is my intention to make mobile a first class citizen in this addon, but hopefully this can fill the gaps for now.



# Primitives

## Draggable Object

The `draggable-object` component represents an object you want to drag onto a target.

The two things to provide to the component are:

* The content - Represents the object to be dragged. Will be passed to the target after a completed drag.
* The template code to render for the draggable object

```handlebars
{{#draggable-object content=this}}
  {{name}}
{{/draggable-object}}
```
At the start of the drag a property of isDraggingObject will be set to true on the content object and false on drag end.

Optionally you can set actions on the component to get notified on drag start and end. The content value of the current object being dragged is sent as the parameter.

```handlebars
{{#draggable-object content=this dragStartAction=(action 'myStartAction') dragEndAction=(action 'myEndAction')}}
  {{name}}
{{/draggable-object}}
```

If you wish to have a drag handle in your component to be the trigger for a drag start action, instead of the whole wrapped template you can specify the jquery selector in the component.

```handlebars
{{#draggable-object content=this dragHandle='.js-dragHandle'}}
  <a class="js-dragHandle dragHandle">This is the only element that triggers a drag action</a>
{{/draggable-object}}
```

There are two action hooks you can call as well.  By default on start drag the element being dragged has an opacity of 0.5 set.
If you want to override that and apply your own stylings you can use the 'dragStartHook' and/or the 'dragEndHook'
The jquery event is passed as the only parameter.

```handlebars
{{#draggable-object content=this dragStartHook=(action 'dragStartAction') dragEndHook=(action 'dragEndAction')}}
  <a class="js-dragHandle dragHandle">This is the only element that triggers a drag action</a>
{{/draggable-object}}
```


```javascript
// represents the controller backing the above template

Ember.Controller.extend({
  // your regular controller code

  actions: {
    myStartAction(content) {
     //Content is the same as the content parameter set above
    },
    myEndAction(content) {
      //Content is the same as the content parameter set above
    },
  }
}
});
```

--------------

## Draggable Object Target

The `draggable-object-target` represents a place to drag objects. This will trigger an action which accepts the dragged object as an argument.

The two things to provide to the component are:

* The action - Represents the action to be called with the dragged object.
* The template code to render for the target.

The action is called with two arguments:

* The dragged object.
* An options hash. Currently the only key is `target`, which is the draggable-object-target component.

```handlebars
... your regular template code

{{#draggable-object-target action=(action "increaseRating") amount="5"}}
  Drag here to increase rating
{{/draggable-object-target}}
```

Optionally you can also get an action fired when an object is being dragged over and out of the drop target. No parameter is currently sent with these actions.

```handlebars
{{#draggable-object-target amount="5" action=(action "increaseRating") dragOverAction=(action "myOverAction") dragOutAction=(action "myDragOutAction")}}
  Drag here to increase rating
{{/draggable-object-target}}
```


```javascript
// represents the controller backing the above template

Ember.Controller.extend({
  // your regular controller code

  actions: {
    increaseRating(obj,ops) {
      var amount = parseInt(ops.target.amount);
      obj.incrementProperty("rating",amount);
      obj.save();
    },
    myOverAction() {
      //will notify you when an object is being dragged over the drop target
    },
    myDragOutAction() {
      //will notify you when an object has left the drop target area
    },
  }
}
});
```
You can check out an example of this is action [here](http://mharris717.github.io/ember-drag-drop/)

## Sorting of objects

We now have a basic sorting capabilities in this library. If you wrap the `{{#sortable-objects}}` component around your `{{#draggable-object}}` components you can get an array of sorted elements returned.

**Important Note on Ember Versions:
If you use Ember version 1.13.2 and above you must user at least addon version 0.3 if you use sorting
If you use Ember version 1.12.1 and below you must use 0.2.3 if you use sorting
This only applies if you use the sort capabilities, regular dragging is not version specific.

An Example:

```handlebars
{{#sortable-objects sortableObjectList=sortableObjectList sortEndAction=(action "sortEndAction") enableSort=true useSwap=true inPlace=false sortingScope="sortingGroup"}}
  {{#each sortableObjectList as |item|}}
    {{#draggable-object content=item isSortable=true sortingScope="sortingGroup"}}
      {{item.name}}
    {{/draggable-object}}
  {{/each}}
{{/sortable-objects}}
```

On drop of an item in the list, the sortableObjectList is re-ordered and the sortEndAction is fired unless the optional parameter 'enableSort' is false. You can check out an example of this is action [here](http://mharris717.github.io/ember-drag-drop/)

`useSwap` defaults to true and is optional. If you set it to false, then the sort algorithm will cascade the swap of items, pushing the values down the list. [See Demo](http://mharris717.github.io/ember-drag-drop/horizontal)

`inPlace` defaults to false and is optional. If you set it to true, then the original list will be mutated instead of making a copy.

`sortingScope` is optional and only needed if you have multiple lists on the screen that you want to share dragging between. [See Demo](http://mharris717.github.io/ember-drag-drop/multiple)

**Note: It's important that you add the isSortable=true to each draggable-object or else that item will be draggable, but will not change the order of any item. Also if you set a custom sortingScope they should be the same for the sortable-object and the draggable-objects it contains.**

## Test Helpers

When writing tests, there is a `drag` helper you can use to help facilitate dragging and dropping.

#### drag helper
 - As of v0.4.5 you can use this helper in integration tests without booting up the entire application.
    - Is an async aware helper ( use await to wait for drop to finish )
 - Can be used to test sortable elements as well as plain draggable 
 - Has one argument 
   - the drag start selector 
   - Example: ```.draggable-object.drag-handle```
 - And many options:
   - **dragStartOptions**
     - options for the drag-start event
     - can be used to set a cursor position for the drag start event 
     - Example:  ```{ pageX: 0, pageY: 0 }``` 
   - **dragOverMoves**
     - array of moves used to simulate dragging over. 
     - it's an array of [position, selector] arrays where the selector is optional
       and will use the 'drop' selector ( from drop options ) as default
     - Example:   
    ```js 
                   [
                     [{ clientX: 1, clientY: 500 }, '.drag-move-div'],  
                     [{ clientX: 1, clientY: 600 }, '.drag-move-div']
                   ]
               or     
                   [
                    [{ clientX: 1, clientY: 500 }], // moves drop selector  
                    [{ clientX: 1, clientY: 600 }] // moves drop selector
                   ] 
    ```
    - **dropEndOptions**
      - options for the drag-end event
      - can be used to set a cursor position for the drag end event  
      - Example:  ```{ pageX: 0, pageY: 0 }```
    - **afterDrag**
      - a function to call after dragging actions are complete
      - gives you a chance to inspect state after dragging
      - Example:
    ```js
       afterDrag() {
         // check on state of things  
       }   
    ```
    - **beforeDrop** 
      - a function to call before drop action is called
      - gives you a chance to inspect state before dropping
      - Example:
    ```js
       beforeDrop() {
         // check on state of things 
       }
    ```
   - **drop**
     - selector for the element to drop onto  
     - Example: ```.drop-target-div```
     
- You import it like this:

```js
// new async helper
import { drag } from 'your-app/tests/helpers/drag-drop';
```

You can pass the CSS selector for the `draggable-object-target` and pass a `beforeDrop` callback.

Async test Example:
             
```js
test('drag stuff', async function(assert) {
  // setup component
  await drag('.draggable-object.drag-handle', {
      drop: '.draggable-container .draggable-object-target:nth-child(1)'
  });
  
  assert.equal("things happened", true);
});
```

In this example,
 - we're dragging the draggable-object element with CSS selector `.draggable-object.drag-handle` 
 - and dropping on a draggable-object-target with the CSS selector `draggable-object-target:eq(1)`. 

For a fuller example check out this integration [test](https://github.com/mharris717/ember-drag-drop/blob/master/tests/integration/components/sortable-objects-test.js#L63)

**Note #1**
  In order to use async / await style tests you need to tell ember-cli-babel to include a polyfill
  in [ember-cli-build.js](https://github.com/mharris717/ember-drag-drop/blob/master/ember-cli-build.js#L7)  

**Note #2** 
  You don't have to use the new async/await helper. 
  You can simply keep using the older drag  helper ( which makes your tests far slower because you have to start the application for each test. )
  This older helper only has one option ( beforeDrop )
    
  ```javascript
  // old drag helper
  import { drag } from 'your-app/tests/helpers/ember-drag-drop';
  ```
 
### TODO

Theses additions to sort are still incoming:

1. ~~Tests for sortable-objects~~
2. Transforms for visual indicator of changing order
3. ~~Ability to drag between sortable containers~~
4. ~~Sorting of horizontal containers (currently only vertical sorting works)~~

If anyone has any feedback/ideas on sorting, please open an issue.

## Component Class Overrides

For both `draggable-object` and `draggable-object-target` you can override the default class names and provide your own, or a variable class name by adding an overrideClass property to the component.

An Example:

```handlebars
{{#draggable-object-target overrideClass='my-new-class-name'}}

{{/draggable-object-target}}
```


# Examples

## Classify Posts

In this example, we have a bunch of unclassified posts that we want to mark either Ready to Publish or Needs Revision.

When you drag a post onto one of the Possible Statuses, it will be:

* Assigned that rating.
* Removed from the Unclassified Posts list, by virtue of now having a status.

app/models/post.js

```javascript
export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  status: DS.attr('string')
});
```

app/controllers/posts.js

```javascript
export default Ember.ArrayController.extend({
  unclassifiedPosts: Ember.computed.filterBy('content', 'status', undefined),

  actions: {
    setStatus: function(post,ops) {
      var status = ops.target.status;
      post.set("status",status);
      post.save();
    }
  }
}
});
```

app/templates/posts.hbs

```handlebars
<h3>Unclassified Posts</h3>
{{#each unclassifiedPosts as |post|}}
  {{#draggable-object content=post}}
    {{post.title}}
  {{/draggable-object}}
{{/each}}

<h3>Possible Statuses</h3>
{{#draggable-object-target action=(action "setStatus") status="Ready to Publish"}}
  Ready to Publish
{{/draggable-object-target}}

{{#draggable-object-target action=(action "setStatus") status="Needs Revision"}}
  Needs Revision
{{/draggable-object-target}}
```
