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