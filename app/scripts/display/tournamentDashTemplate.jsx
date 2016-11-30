var $ = window.jQuery = require('jquery');
var Backbone = require('backbone');
var React = require('react');
require('bootstrap-sass');
var moment = require('moment');

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
            <a className="navbar-brand top-level" href="#/">
              <img className="logo-small img-fluid" alt="The Standings Logo" src="images/the-standings-logo-white.png" />
            </a>
            <ul className="list-inline nav-list pull-right">
              <li><a href={'#/tournaments/'+this.state.tournament.get('objectId')+'/'}>Tournament Overview</a></li>
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
            <button className="btn btn-primary weather-btn top-level" type="button" data-toggle="collapse" data-target="#weather-info" aria-expanded="false" aria-controls="collapseExample">
              Weather Forcast <i className="fa fa-caret-down" aria-hidden="true"></i>
            </button>
            <div className="weather-div collapse col-md-10 col-md-offset-1 loading-parent top-level" id="weather-info">
              <h4 className="pull-right">Weather Info for {this.state.tournament.get('city')}, {this.state.tournament.get('state')}</h4>
              <h2>{this.state.tournament.get('weather_date')}</h2>
              <h1 className="text-center">{this.state.tournament.get('weather_summary') ? this.state.tournament.get('weather_summary') : "Updating Weather..."}</h1>
              <div className="col-sm-8 col-sm-offset-2">
                <span className="temp pull-left">
                  <span className="dark-blue">Low: </span>
                    {this.state.tournament.get('weather_low')} &deg;
                </span>
                <span className="temp pull-right">
                  <span className="accent">High: </span>
                    {this.state.tournament.get('weather_high')} &deg;
                </span>
              </div>
              <div className={this.props.isLoadingWeather ? 'show loading-div' : 'hidden loading-div'}></div>
            </div>
          </nav>
        <div className="row main-body">
          {this.props.children}
        </div>
        <div className="row">
          <footer className="footer bg-blue">
            <a href="#">
              <div className="parent inline-block">
                <img src="images/the-standings-logo-white.png" className="logo-small" />
                <span className="limo copyright child">Copyright &copy; 2016 Luis Rene Onate</span>
              </div>
            </a>
          </footer>
        </div>
      </div>
    );
  }
});

module.exports = {
  TournamentDashTemplate: TournamentDashTemplate
};
