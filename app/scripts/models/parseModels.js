var Backbone = require('backbone');

var ParseModel = Backbone.Model.extend({
  idAttribute: 'objectId',
});

var ParseCollection = Backbone.Collection.extend({
  parse: function(data){
    return data.results;
  }
});

module.exports = {
  ParseModel: ParseModel,
  ParseCollection: ParseCollection
};
