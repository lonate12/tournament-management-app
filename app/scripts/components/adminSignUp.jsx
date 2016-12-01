var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var User = require('../models/user.js').User;
var Tournament = require('../models/tournament.js').Tournament;
require('../3rd-party-plugins/masks.js');

var AdminSignUpContainer = React.createClass({
  getInitialState: function(){
    var admin = new User();
    return{
      'admin': admin,
      'first_name': '',
      'last_name': '',
      'email': '',
      'phone_number': '',
      'username': '',
      'password': '',
      isLoading: false
    };
  },
  handleInputChangeAdmin: function(e){
    e.preventDefault();
    var target = e.target;

    var newState = {};
    newState[target.name] = target.value;
    this.setState(newState);

    this.state.admin.set(target.name, target.value);
    this.state.admin.set('username', this.state.admin.get('email'));
    this.setState({admin: this.state.admin});
  },
  handleAdminSubmit: function(e){
    e.preventDefault();
    var self = this;

    if (e.target[4].value != e.target[5].value){
      alert("Passwords do not match, please re-enter password.")

      return;
    }

    this.setState({isLoading: true});

    this.state.admin.signUp(function(){
      self.setState({isLoading: false});
      Backbone.history.navigate('/add-tournament/', {trigger: true});
    });

  },
  componentWillMount: function(){
    this.state.admin.set('isAdmin', true);
  },
  componentDidMount: function(){
    $('#phone_number').mask('(000) 000-0000');
  },
  render: function(){
    return(
      <div className="container-fluid bg-blue" id="sign-up-body-container">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2 login-logo-div clearfix">
            <a href="#">
              <img className="login-logo" src="images/the-standings-logo-white.png" alt="The Standings Logo" />
            </a>
          </div>
          <div className="col-sm-8 col-sm-offset-2 loading-parent">
            <form onSubmit={this.handleAdminSubmit} className="form" id="captain-sign-up">
              <h1 className="col-sm-12 text-center sign-up-header">Tournament Admin Sign Up <i className="fa fa-user-plus"></i></h1>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="first_name" id="first_name" required="required"/>
                <label htmlFor="last_name">Last Name</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="last_name" id="last_name" required="required"/>
                <label htmlFor="phone_number">Contact Number</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="phone_number" id="phone_number" required="required"/>
                <label htmlFor="email">Email</label>
                <input onChange={this.handleInputChangeAdmin} type="email" className="form-control" name="email" id="email" required="required"/>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input onChange={this.handleInputChangeAdmin} type="password" className="form-control" name="password" id="password" required="required"/>
                  <label htmlFor="password2">Re-enter Password</label>
                  <input onChange={this.handleInputChangeAdmin} type="password" className="form-control" name="password2" id="password2" required="required"/>
                </div>
              </div>
              <button type="submit" className="btn btn-accent dark-blue">Sign Up</button>
            </form>
            <div className={this.state.isLoading ? 'show loading-div' : 'hidden loading-div'}></div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  AdminSignUpContainer: AdminSignUpContainer
};
