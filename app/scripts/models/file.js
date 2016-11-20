var Backbone = require('backbone');

var FileModel = Backbone.Model.extend({
  defaults: {
    name: 'default.jpg'
  },
  idAttribute: 'objectId',
  urlRoot: function(){
    var url = 'https://zugzwang.herokuapp.com/files/';

    return url + encodeURIComponent(this.get('name'));
  },
  save: function(attributes, options){
    options = options || {};
    attributes = attributes || {};

    this.set(attributes);

    var image = this.get('data');

    if (!image) {
      throw 'Please attach a file.'
    }

    options.data = image;

    options.beforeSend = function(request){
      request.setRequestHeader("X-Parse-Application-Id", "zugzwang");
      request.setRequestHeader("X-Parse-Rest-API-Key", "tosche station");
      request.setRequestHeader("Content-Type", image.type);
    };

    options.processData = false;

    options.contentType = false;

    return Backbone.Model.prototype.save.call(this, attributes, options);
  }
});

module.exports = {
  FileModel: FileModel
};
