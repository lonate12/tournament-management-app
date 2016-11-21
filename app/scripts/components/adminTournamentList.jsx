var React = require('react');
var TournamentCollection = require('../models/tournament.js').TournamentCollection;

var AdminTournamentList = React.createClass({
  getInitialState: function(){
    var tournaments = new TournamentCollection();

    return{
      tournaments: tournaments
    };
  },
  componentWillMount: function(){
    var tournaments = this.state.tournaments, self = this;

    tournaments.parseWhere("tournament_admin", "_User", localStorage.getItem('userID')).fetch().then(function(response){
      self.setState({tournaments: tournaments});
    });
  },
  render: function(){
    var tournaments = this.state.tournaments;

    var tournamentList = tournaments.map(function(tournament){
      return(
        <li key={tournament.get('objectId')}>{tournament.get('tournament_name')}</li>
      );
    });
    return(
      <div>
        <h1>AdminTournamentList</h1>
        <ul>
          {tournamentList}
        </ul>
      </div>
    );
  }
});

module.exports = {
  AdminTournamentList: AdminTournamentList
};
