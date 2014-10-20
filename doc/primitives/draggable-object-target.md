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