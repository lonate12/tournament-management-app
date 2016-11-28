var Backbone = require('backbone');
var React = require('react');
var Team = require('../models/team.js').Team;
var Game = require('../models/game.js').Game;

var EditGameScore = React.createClass({
  getInitialState: function(){
    return{
      game: new Game(),
      home_team: new Team(),
      away_team: new Team(),
    };
  },
  componentWillMount: function(){
    var self = this, game = this.state.game, home_team = this.state.home_team
    , away_team = this.state.away_team, home_points = this.state.home_points
    , away_points = this.state.away_points;

    game.set('objectId', this.props.gameId).fetch().then(function(){
      home_team.set('objectId', game.get('home_team').objectId).fetch().then(function(){
        self.setState({home_team: home_team, home_points: home_team.get('points')});
      });

      away_team.set('objectId', game.get('away_team').objectId).fetch().then(function(){
        self.setState({away_team: away_team, away_points: away_team.get('points')});
      });
    });
  },
  addScoreHome: function(){
    var game = this.state.game
    , currentHomeScore = game.get('home_team_score');

    currentHomeScore += 1;

    game.set('home_team_score', currentHomeScore);

    this.setState({game: game});
  },
  subtractScoreHome: function(){
    var game = this.state.game
    , currentHomeScore = game.get('home_team_score');

    currentHomeScore -= 1;
    currentHomeScore = currentHomeScore < 0 ? 0 : currentHomeScore;

    game.set('home_team_score', currentHomeScore);

    this.setState({game: game});
  },
  addScoreAway: function(){
    var game = this.state.game
    , currentAwayScore = game.get('away_team_score');

    currentAwayScore += 1;
    game.set('away_team_score', currentAwayScore);

    this.setState({game: game});
  },
  subtractScoreAway: function(){
    var game = this.state.game
    , currentAwayScore = game.get('away_team_score');

    currentAwayScore -= 1;
    currentAwayScore = currentAwayScore < 0 ? 0 : currentAwayScore;

    game.set('away_team_score', currentAwayScore);

    this.setState({game: game});
  },
  saveChanges: function(){
    var game = this.state.game, home_team = this.state.home_team, away_team = this.state.away_team
    , home_score = this.state.game.get('home_score'), away_score = this.state.game.get('away_score')
    , homeTeamPoints = home_team.get('points'), awayTeamPoints = away_team.get('points'), ajaxCounter = 0
    , self = this;

    if (home_score > away_score){
      homeTeamPoints += 3;
      home_team.set('points', homeTeamPoints);
    }else if (away_score > home_score){
      awayTeamPoints += 3;
      away_team.set('points', awayTeamPoints);
    }else{
      home_team.set('points', homeTeamPoints+=1);
      away_team.set('points', awayTeamPoints+=1);
    }

    game.set('has_been_played', true);

    game.save().then(function(){
      ajaxCounter += 1;
      if (ajaxCounter == 3) {
        Backbone.history.navigate('/tournaments/'+self.props.tournamentId+'/admin/',{trigger: true});
      }
    });

    home_team.save().then(function(){
      ajaxCounter += 1;
      if (ajaxCounter == 3) {
        Backbone.history.navigate('/tournaments/'+self.props.tournamentId+'/admin/',{trigger: true});
      }
    });

    away_team.save().then(function(){
      ajaxCounter += 1;
      if (ajaxCounter == 3) {
        Backbone.history.navigate('/tournaments/'+self.props.tournamentId+'/admin/',{trigger: true});
      }
    });
  },
  render: function(){
    var game = this.state.game, home_team = this.state.home_team, away_team = this.state.away_team;

    return(
      <div className="container">
        <h1>Group {home_team.get('group')} game: {home_team.get('name')} vs {away_team.get('name')}</h1>
        <div className="row">
          <div className="col-sm-6">
            <div className="col-sm-12">
              <h2>{home_team.get('name')}</h2>
              <h1>{game.get('home_team_score')}</h1>
              <div className="row">
                <button onClick={this.subtractScoreHome} className="glyphicon glyphicon-minus-sign col-xs-6 minus-score btn btn-danger"></button>
                <button onClick={this.addScoreHome} className="glyphicon glyphicon-plus-sign col-xs-6 add-score btn btn-success"></button>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="col-sm-12">
              <h2>{away_team.get('name')}</h2>
              <h1>{game.get('away_team_score')}</h1>
              <div className="row">
                <button onClick={this.subtractScoreAway} className="glyphicon glyphicon-minus-sign col-xs-6 minus-score btn btn-danger"></button>
                <button onClick={this.addScoreAway} className="glyphicon glyphicon-plus-sign col-xs-6 add-score btn btn-success"></button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <button onClick={this.saveChanges} type="button" className="btn btn-primary pull-right">Save Changes</button>
        </div>
      </div>
    );
  }
});

module.exports = {
  EditGameScore: EditGameScore
};
