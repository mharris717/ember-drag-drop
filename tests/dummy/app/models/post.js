import DS from 'ember-data';

var Post = DS.Model.extend({
  title: DS.attr("string"),
  body: DS.attr("string"),
  author: DS.attr("string"),
  rating: DS.attr('string')
});

var mockBody = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";


var makeFixtures = function() {
  var res = [];
  var names = ["Adam","Bill","Carl"];

  for (var i=0;i<10;i++) {
    var id = i + 1;
    var name = names[i%names.length];

    res.push({id: id, title: "Title "+id, body: mockBody, author: name, rating: "unclassified"});
  }
  return res;
};

Post.reopenClass({
  FIXTURES: makeFixtures()
});

export default Post;