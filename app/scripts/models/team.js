var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;

var Team = ParseModel.extend({
});

var TeamCollection = ParseCollection.extend({
  model: Team,
  url: 'https://zugzwang.herokuapp.com/classes/Teams',
});

module.exports = {
  Team: Team,
  TeamCollection: TeamCollection
};
