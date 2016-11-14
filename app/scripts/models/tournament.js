var Backbone = require('backbone');

var Tournament = Backbone.Model.extend({
  idAttribute: 'objectId'
});

module.exports = {
  Tournament: Tournament
};
