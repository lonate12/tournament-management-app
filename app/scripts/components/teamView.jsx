var React = require('react');
var TournamentDashTemplate = require('../display/tournamentDashTemplate.jsx').TournamentDashTemplate;
var Tournament = require('../models/tournament.js').Tournament;
var Team = require('../models/team.js').Team;
var TeamCollection = require('../models/team.js').TeamCollection;
var GameCollection = require('../models/game.js').GameCollection;
var moment = require('moment');

var TeamViewContainer = React.createClass({
  getInitialState: function(){
    var tournament = new Tournament();
    var currentTeam = new Team();
    var games = new GameCollection();

    return{
      tournament: tournament,
      currentTeam: currentTeam,
      games: games,
      teams: new TeamCollection(),
      group: new TeamCollection(),
      isLoadingWeather: true,
      isLoadingTeam: true,
      isLoadingGroup: true,
      isLoadingGames: true
    }
  },
  componentWillMount: function(){
    var self = this, tournament = this.state.tournament, team = this.state.currentTeam
    , teams = this.state.teams, games = this.state.games;

    tournament.set('objectId', this.props.tournamentId);
    tournament.fetch().then(function(){
      tournament.getWeather(function(){
        self.setState({tournament: tournament, isLoadingWeather: false});
      });
    });

    games.parseWhere('home_team', 'Teams', this.props.teamId).fetch().then(function(){
      games.parseWhere('away_team', 'Teams', self.props.teamId).fetch({remove: false}).then(function(){
        self.setState({isLoadingGames: false});
      });
    });

    team.set('objectId', this.props.teamId);
    team.fetch().then(function(response){
      self.setState({isLoadingTeam: false});

      teams.parseWhere('tournament', 'Tournaments', self.props.tournamentId).fetch().then(function(){
        var group = new TeamCollection();
        var thisGroup = teams.filter(function(team){return team.get('group') === self.state.currentTeam.get('group')});
        group.set(thisGroup);
        var sortedGroup = group.sortBy(function(team){return -team.get('points')});
        group.set(sortedGroup);

        self.setState({teams: teams, group: group, isLoadingGroup: false});
      });
    });

  },
  render: function(){
    var currentTeam = this.state.currentTeam, self = this, teams = this.state.teams, games;
    var group = this.state.group.map(function(team){
      return(
        <li key={team.get('objectId')} className="list-group-item">
          <a href={'#/tournaments/'+self.props.tournamentId+'/'+team.get('objectId')+'/'}>
            {team.get('name')}
          </a>
          <span className="pull-right">{team.get('points')}</span>
        </li>
      );
    });

    games = this.state.games.map(function(game){
      var homeTeam = game.get('home_team').objectId, awayTeam = game.get('away_team').objectId
      , className, teamArray = [homeTeam, awayTeam];

      var opponentArray = teamArray.filter(function(team){
        return team != currentTeam.get('objectId');
      });

      var opponent = opponentArray[0];
      opponent = self.state.teams.get(opponent);

      return (
        <tr key={game.get('objectId')}>
          <td>{opponent ? opponent.get('name') : 'Loading...'}</td>
          <td>{game.get('location_name') ? game.get('location_name') : "TBD"}</td>
          <td>{game.get('time') ? moment(game.get('time')).format("dddd, MM/DD") : "TBD"}</td>
          <td>{game.get('time') ? moment(game.get('time')).format("hh:mm a") : "TBD"}</td>
        </tr>
      );

    });

    return(
      <TournamentDashTemplate teams={this.state.teams} tournament={this.state.tournament} isLoadingWeather={this.state.isLoadingWeather}>
        <div className="row">
          <div className="col-md-4 loading-parent">
            <div className="col-md-12">
              <div className={this.state.isLoadingTeam ? 'show loading-div' : 'hidden loading-div'}></div>
              <h2 className="team-name team-detail-name">{currentTeam.get('name')}</h2>
              <img className="img-thumbnail img-fluid team-detail-img" src={currentTeam.get('logo') ? currentTeam.get('logo') : '../../dist/images/default-logo.png'} />
            </div>
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 col-md-offset-3 loading-parent">
                <h2>Group {this.state.currentTeam.get('group')}</h2>
                <ul className="list-group">
                  {group}
                </ul>
                <div className={this.state.isLoadingGroup ? 'show loading-div' : 'hidden loading-div'}></div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10 col-md-offset-1 loading-parent">
                <h2>{this.state.currentTeam.get('name')} Games</h2>
                <table className="table col-md-12">
                  <thead>
                    <tr>
                      <th>Opponent</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games}
                  </tbody>
                </table>
                <div className={this.state.isLoadingGames ? 'show loading-div' : 'hidden loading-div'}></div>
              </div>
            </div>
          </div>
        </div>
      </TournamentDashTemplate>
    );
  }
});

module.exports = {
  TeamViewContainer: TeamViewContainer
};
