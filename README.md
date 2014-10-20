# Ember Drag Drop

[![Build Status](https://travis-ci.org/mharris717/ember-drag-drop.svg?branch=master)](https://travis-ci.org/mharris717/ember-drag-drop)

Simple drag and drop addon for your Ember CLI app.

The goal is to allow you to add drag and drop to your app without having to become an expert in the browser's low level D&D API.

To use this addon, you don't need to:

* Know anything about how the browser implements drag and drop.
* Ever deal with a browser drag and drop event, or even know that they exist.

When using this addon, you get to work with objects in your domain layer, just like everywhere else in Ember. The only two things you need to use are (as you might expect) [Draggable Object](#draggable-object) and [Draggable Object Target](#draggable-object-target)

## Requirements

- ember-cli 0.0.39 or higher
- ember-drag-drop 0.1.0 or higher (to match current docs)

## Installation

```
npm install ember-drag-drop --save-dev
```

## Thanks

Huge thanks to [ic-droppable](https://github.com/instructure/ic-droppable), from which I shamelessly stole as promised. 

<!--- START GENERATED DOCS -->

# Usage



#### Primitives

* [Draggable Object](#draggable-object)
* [Draggable Object Target](#draggable-object-target)

#### Examples

* [Classify Posts](#classify-posts)





# Primitives

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

{{#draggable-object-target action="increaseRating" amount="5"}}
  Drag here to increase rating
{{/draggable-object-target}}
```

```javascript
// represents the controller backing the above template

Ember.Controller.extend({
  // your regular controller code

  actions: {
    increaseRating: function(obj,ops) {
      var amount = parseInt(ops.target.amount);
      obj.incrementProperty("rating",amount);
      obj.save();
    }
  }
}
});
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
{{#each post in unclassifiedPosts}}
  {{#draggable-object model=post}}
    {{post.title}}
  {{/draggable-object}}
{{/each}}

<h3>Possible Statuses</h3>
{{#draggable-object-target action="setStatus" status="Ready to Publish"}}
  Ready to Publish
{{/draggable-object-target}}

{{#draggable-object-target action="setStatus" status="Needs Revision"}}
  Needs Revision
{{/draggable-object-target}}
```

