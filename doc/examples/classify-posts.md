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
{{#draggable-object-target action=(action 'setStatus') status="Ready to Publish"}}
  Ready to Publish
{{/draggable-object-target}}

{{#draggable-object-target action=(action 'setStatus') status="Needs Revision"}}
  Needs Revision
{{/draggable-object-target}}
```
