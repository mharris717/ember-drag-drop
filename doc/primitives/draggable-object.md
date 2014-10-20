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