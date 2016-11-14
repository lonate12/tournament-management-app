var Backbone = require('backbone');

var Game = Backbone.Model.extend({
  idAttribute = 'objectId'
});

var GameCollection = Backbone.Collection.extend({
  model: Team,
  url: 'https://zugzwang.herokuapp.com/classes/Games',
  parse: function(data){
    return data.results
  }
});

module.exports = {
  Game: Game,
  GameCollection: GameCollection
};
