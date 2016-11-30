var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;
var TeamCollection = require('../models/team.js').TeamCollection;
var GameCollection = require('../models/game.js').GameCollection;

var TournamentDashboardContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    var teams = new TeamCollection();
    var games = new GameCollection();

    return{
      tournament: tournament,
      teams: teams,
      games: games
    };
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, teams = this.state.teams
    , games = this.state.games;

    tournament.set('objectId', this.props.tournamentId);
    tournament.fetch().then(function(response){
      tournament.getWeather(function(){
        self.setState({tournament: tournament});
      });
    });

    teams.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({teams: teams});
    });

    games.parseWhere('tournament', 'Tournaments', this.props.tournamentId).fetch().then(function(){
      self.setState({games: games});
    });
  },
  render: function(){
    var self = this, teams = this.state.teams, games = this.state.games, standings = "Placeholder";
    var gA = new TeamCollection(), gB = new TeamCollection(), gC = new TeamCollection, gD = new TeamCollection;
    var groupArray = [gA, gB, gC, gD];

    teams.each(function(team){
      var group = team.get('group');
      if(group == 'A'){
        groupArray[0].add(team);
      }else if(group == 'B'){
        groupArray[1].add(team);
      }else if(group == 'C'){
        groupArray[2].add(team);
      }else{
        groupArray[3].add(team);
      }
    });

    groupArray.forEach(function(group,i){
      group = group.sortBy(function(team){
        return -team.get('points');
      });
      return groupArray[i] = group;
    });

    groupArray.forEach(function(group,i){
      group = group.map(function(team,i){
        var classes;
        if (i > 1){
          classes = 'list-group-item list-group-item-danger';
        }else{
          classes = 'list-group-item list-group-item-success';
        }

        return(
          <li key={team.get('objectId')} className={classes}>
            {team.get('name')}
            <span className="tag tag-default tag-pill pull-right">{team.get('points') + ' pts'}</span>
          </li>
        );
      });
      return groupArray[i] = group;
    });

    var teamsList = teams.map(function(team){
      return (
        <li key={team.get('objectId')} className="list-group-item bg-blue"><a>{team.get('name')}</a></li>
      );
    });

    var games = games.map(function(game){
      return (
        <tr key={game.get('objectId')}>
          <td><a href={'#/tournaments/'+self.props.tournamentId+'/'+game.get('home_team').objectId+'/'}>{game.get('home_team_name')}</a> {game.get('home_team_score')}</td>
          <td><a href={'#/tournaments/'+self.props.tournamentId+'/'+game.get('home_team').objectId+'/'}>{game.get('away_team_name')}</a> {game.get('away_team_score')}</td>
          <td><a href={'#/tournaments/'+self.props.tournamentId+'/fields/'+game.get('location').objectId+'/'}>{game.get('location_name')}</a></td>
        </tr>
      );
    });

    return(
      <TournamentDashTemplate teams={this.state.teams} tournament={this.state.tournament}>
        <div className="col-md-4">
          <h1 className="white">Teams</h1>
          <ul className="list-group">
            {teamsList}
          </ul>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <h1 className="white">Standings</h1>
                <div className="row">
                  <div className="col-md-3">
                    <h4 className="white">Group A</h4>
                    <ul className="list-group">
                      {groupArray[0]}
                    </ul>
                  </div>
                  <div className="col-md-3">
                    <h4 className="white">Group B</h4>
                    <ul className="list-group">
                      {groupArray[1]}
                    </ul>
                  </div>
                  <div className="col-md-3">
                    <h4 className="white">Group C</h4>
                    <ul className="list-group">
                      {groupArray[2]}
                    </ul>
                  </div>
                  <div className="col-md-3">
                    <h4 className="white">Group D</h4>
                    <ul className="list-group">
                      {groupArray[3]}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h1 className="white">Games</h1>
              <table className="table">
                <thead>
                  <tr>
                    <th>Home Team</th>
                    <th>Away Team</th>
                    <th>Location</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {games}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TournamentDashboardContainer: TournamentDashboardContainer
};
