var $ = require('jquery');
var React = require('react');

var TournamentDashTemplate = React.createClass({
  getInitialState: function(){
    return{
      tournament: this.props.tournament,
      isLoadingWeather: true
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({tournament: nextProps.tournament, isLoadingWeather: nextProps.isLoadingWeather});
  },
  render: function(){

    return(
      <div className="container">
        <div className="row tournament-info-div">
          <h1 className="col-sm-12 tournament-name-h1">{this.state.tournament.get('tournament_name') ? this.state.tournament.get('tournament_name') : 'Welcome'}</h1>
          <div className="weather-info-div loading-parent">
            <div className={this.props.isLoadingWeather ? 'show loading-div' : 'hidden loading-div'}></div>
            <h4>Weather Info for {this.state.tournament.get('city')}, {this.state.tournament.get('state')}</h4>
            <p>{this.state.tournament.get('weather_summary') ? this.state.tournament.get('weather_summary') : "Updating Weather"}</p>
          </div>
        </div>
        <div className="row">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = {
  TournamentDashTemplate: TournamentDashTemplate
};
