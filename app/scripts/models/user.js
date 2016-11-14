var Backbone = require('backbone');

var User = Backbone.Model.extend({
  idAttribute: 'objectId'
});

module.exports = {
  User: User
};
