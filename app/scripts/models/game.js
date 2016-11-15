var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;

var Game = ParseModel.extend({
});

var GameCollection = ParseCollection.extend({
  model: Team,
  url: 'https://zugzwang.herokuapp.com/classes/Games',
});

module.exports = {
  Game: Game,
  GameCollection: GameCollection
};
