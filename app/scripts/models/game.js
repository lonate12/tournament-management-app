var Backbone = require('backbone');
var ParseModel = require('./parseModels.js').ParseModel;
var ParseCollection = require('./parseModels.js').ParseCollection;

var Game = ParseModel.extend({
  defaults: {
    'home_team': {},
    'away_team': {},
    'location': {},
    'time': '',
    'home_team_score': 0,
    'away_team_score': 0,
    'has_been_played': false,
    'group_game': true,
    'quarter_final': null,
    'semi_final': null,
    'final': null
  },
  urlRoot: 'https://zugzwang.herokuapp.com/classes/Games/'
});

var GameCollection = ParseCollection.extend({
  model: Game,
  baseUrl: 'https://zugzwang.herokuapp.com/classes/Games/',
});

module.exports = {
  Game: Game,
  GameCollection: GameCollection
};
