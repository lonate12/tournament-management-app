var Backbone = require('backbone');
var React = require('react');
var Game = require('../models/game.js').Game;
var TeamCollection = require('../models/team.js').TeamCollection;
var LocationCollection = require('../models/location.js').LocationCollection;

var EditGame = React.createClass({
  getInitialState: function(){
    return {
      game: new Game(),
      teams: new TeamCollection(),
      locations: new LocationCollection()
    }
  },
  componentWillMount: function(){
    var game = this.state.game
    , teams = this.state.teams
    , locations = this.state.locations
    , self = this;

    game.set({objectId: this.props.gameId});
  },
  render: function(){
    return(
      <h1>EditGame</h1>
    );
  }
});

module.exports = {
  EditGame: EditGame
};
