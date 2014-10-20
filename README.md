# Ember-drag-drop

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

<!--- START GENERATED DOCS -->

# Usage

#### Scenarios



#### Primitives

* [Draggable Object Target](#draggable-object-target)
* [Draggable Object](#draggable-object)
* [Object Bin](#object-bin)

#### Other



# Scenarios



# Primitives

## Draggable Object Target

The `draggable-object-target` represents a place to drag objects. This will trigger an action which accepts the dragged object as an argument.

The two things to provide to the component are:

* The action - Represents the action to be called with the dragged object.
* The template code to render for the target.

```handlebars
... your regular template code

{{#draggable-object-target action="increaseRating"}}
  Drag here to increase rating
{{/draggable-object-target}}
```

```javascript
// represents the controller backing the above template

Ember.Controller.extend({
  // your regular controller code

  actions: {
    increaseRating: function(obj) {
      obj.incrementProperty("rating",1);
      obj.save();
    }
  }
}
});
```

--------------

## Draggable Object

The `draggable-object` component represents an object you want to drag onto a target.

The two things to provide to the component are:

* The model - Represents the object to be dragged. Will be passed to the target after a completed drag.
* The template code to render for the draggable object

```handlebars
{{#draggable-object model=this}}
  {{name}}
{{/draggable-object}}
```

--------------

## Object Bin

No docs yet.

# Other

