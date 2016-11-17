var $ = require('jquery');
var React = require('react');

var TournamentDashTemplate = React.createClass({
  getInitialState: function(){
    return{
      tournament: this.props.tournament
    }
  },
  componentWillReceiveProps: function(nextProps){
    this.setState({tournament: nextProps.tournament});
  },
  render: function(){

    return(
      <div className="container">
        <div className="row">
          <h1 className="col-sm-8 col-sm-offset-2">{this.state.tournament.get('tournament_name') ? this.state.tournament.get('tournament_name') : 'Welcome'}</h1>
          <h1>{this.state.tournament.get('weather_summary') ? this.state.tournament.get('weather_summary') : "Updating Weather"}</h1>
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
