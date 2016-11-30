var $ = window.jQuery = require('jquery');
var Backbone = require('backbone');
var React = require('react');
require('bootstrap-sass');

var TournamentDashTemplate = React.createClass({
  getInitialState: function(){
    return{
      tournament: this.props.tournament,
      isLoadingWeather: true,
      dropDownToggled: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({tournament: nextProps.tournament, isLoadingWeather: nextProps.isLoadingWeather});
  },
  // toggleDropDown: function(e){
  //   var tId = this.state.tournament.get('objectId');
  //   var teamId;
  //
  //   if(e.target.id){
  //     teamId = e.target.id;
  //
  //     Backbone.history.navigate('/tournaments/'+tId+'/'+teamId+'/', {trigger:true});
  //     return;
  //   }
  //
  //   this.setState({dropDownToggled: !this.state.dropDownToggled});
  //   console.log(this.state.dropDownToggled);
  // },
  render: function(){
    var self = this;
    var teams = this.props.teams.map(function(team){
      return(
        <li key={team.cid} id={team.get('objectId')}>
          <a href={'#/tournaments/'+self.state.tournament.get('objectId')+'/'+team.get('objectId')+'/'}>
            {team.get('name')}
          </a>
        </li>
      );
    });

    return(
      <div className="container-fluid">
          <nav className="row tournament-nav">
              <a className="navbar-brand" href="#">
                <img className="logo-small img-fluid" alt="The Standings Logo" src="../../dist/images/the-standings-logo-white.png" />
              </a>
            <ul className="list-inline nav-list pull-right">
              <li><a href={'#/tournaments/'+this.state.tournament.get('objectId')+'/'}>Overview</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                  Teams <i className="fa fa-caret-down"></i></a>
                <ul className="dropdown-menu">
                    {teams}
                  </ul>
              </li>
              <li><a href="#">Locations</a></li>
            </ul>
            <p className="tournament-name">
              <a href={'#/tournaments/'+this.state.tournament.get('objectId')+'/'}>
                {this.state.tournament.get('tournament_name') ? this.state.tournament.get('tournament_name') : 'Welcome'}
              </a>
            </p>
          </nav>
        <div className="row main-body">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = {
  TournamentDashTemplate: TournamentDashTemplate
};
/*
Weather Div
  <div className={this.props.isLoadingWeather ? 'show loading-div' : 'hidden loading-div'}></div>
  <h4>Weather Info for {this.state.tournament.get('city')}, {this.state.tournament.get('state')}</h4>
  <p>{this.state.tournament.get('weather_summary') ? this.state.tournament.get('weather_summary') : "Updating Weather"}</p>
  </div>
*/
