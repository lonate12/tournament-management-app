var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;

var Game = ParseModel.extend({
  defaults: {
    'home_team': {},
    'away_team': {},
    'field': {},
    'time': ''
  }
});

var GameCollection = ParseCollection.extend({
  model: Game,
  baseUrl: 'https://zugzwang.herokuapp.com/classes/Games/',
});

module.exports = {
  Game: Game,
  GameCollection: GameCollection
};