var Backbone = require('backbone');
var React = require('react');
var User = require('../models/user.js').User;
var TournamentCollection = require('../models/tournament.js').TournamentCollection;

var AdminLoginContainer = React.createClass({
  getInitialState: function(){
    var currentUser = new User();

    return{
      currentUser: currentUser,
      username: '',
      password: ''
    }
  },
  handleInput: function(e){
    e.preventDefault();
    var target = e.target;
    var newObject = {};

    newObject[target.name] = target.value;
    this.setState(newObject);
    console.log(this.state);
  },
  handleSubmit: function(e){
    e.preventDefault();
    var tournaments = new TournamentCollection();
    this.state.currentUser.login(this.state.username, this.state.password, function(response){
      console.log(response);
      tournaments.parseWhere('tournament_admin', '_User', response.objectId).fetch().then(function(){
        console.log(tournaments.first());
        if (tournaments.length == 1) {
          Backbone.history.navigate('/tournaments/'+tournaments.first().get('objectId')+'/admin/',{trigger: true});
        } else {
          Backbone.history.navigate('/admin/tournaments/',{trigger: true});
        }
      });

    });
  },
  render: function(){
    return(
      <div className="container">
        <div className="row">
          <form onSubmit={this.handleSubmit} className="col-sm-8 col-sm-offset-2">
            <h1>Login</h1>
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input onChange={this.handleInput} type="email" className="form-control" name="username" id="username" placeholder="Enter email" required="required"/>
              <label htmlFor="password">Password</label>
              <input onChange={this.handleInput} type="password" className="form-control" name="password" id="password" placeholder="Password" required="required"/>
            </div>
            <button type="submit" className="btn btn-default">Login</button>
          </form>
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <p className="pull-right">Don't have an account? Contact <a href="mailto:lonate12@gmail.com?Subject=Interested%20in%20using%20The%20Standings!"><span className="accent">Rene</span></a> for a special link to sign up!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  AdminLoginContainer: AdminLoginContainer
};
