var $ = require('jquery');
var React = require('react');
var User = require('../models/user.js').User;
var Backbone = require('backbone');
require('../3rd-party-plugins/masks.js');

var TeamAdminSignUpContainer = React.createClass({
  getInitialState: function(){
    var teamAdmin = new User();
    return{
      'teamAdmin': teamAdmin,
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

    this.state.teamAdmin.set(target.name, target.value);
    this.state.teamAdmin.set('username', this.state.teamAdmin.get('email'));
    this.setState({admin: this.state.teamAdmin});
  },
  handleAdminSubmit: function(e){
    e.preventDefault();
    var self = this;

    if (e.target[4].value != e.target[5].value){
      alert("Passwords do not match, please re-enter password.")

      return;
    }

    this.setState({isLoading: true});

    this.state.teamAdmin.signUp(function(){
      Backbone.history.navigate('/tournaments/'+self.props.tournamentId+'/add-team/', {trigger: true});
    });

    this.setState({
      'first_name': '',
      'last_name': '',
      'email': '',
      'phone_number': '',
      'username': '',
      'password': '',
      isLoading: false
    });
  },
  componentWillMount: function(){
    $('#phone_number').mask('(000) 000-0000');
  },
  render: function(){
    return(
      <div className="container-fluid bg-blue" id="team-admin-sign-up">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2 login-logo-div clearfix">
            <a href="#">
              <img className="login-logo" src="images/the-standings-logo-white.png" alt="The Standings Logo" />
            </a>
          </div>
          <div className="col-sm-8 col-sm-offset-2">
            <form onSubmit={this.handleAdminSubmit} className="form loading-parent" id="captain-sign-up">
              <h1>Sign up to register your team <i className="fa fa-clipboard white" aria-hidden="true"></i></h1>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="first_name" id="first_name" placeholder="First Name" value={this.state.first_name} required="required"/>
                <label htmlFor="last_name">Last Name</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="last_name" id="last_name" placeholder="Last Name" value={this.state.last_name} required="required"/>
                <label htmlFor="phone_number">Contact Number</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="phone_number" id="phone_number" placeholder="(###) ###-####" value={this.state.phone_number} required="required"/>
                <label htmlFor="email">Email</label>
                <input onChange={this.handleInputChangeAdmin} type="email" className="form-control" name="email" id="email" placeholder="Enter email" value={this.state.email} required="required"/>
                <label htmlFor="password">Password</label>
                <input onChange={this.handleInputChangeAdmin} type="password" className="form-control" name="password" id="password" placeholder="Password" value={this.state.password} required="required"/>
                <label htmlFor="password2">Re-enter Password</label>
                <input onChange={this.handleInputChangeAdmin} type="password" className="form-control" name="password2" id="password2" placeholder="Re-enter password" value={this.state.password2} required="required"/>
              </div>
              <button type="submit" className="btn btn-accent dark-blue">Sign Up</button>
              <div className={this.state.isLoading ? 'show loading-div' : 'hidden loading-div'}></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  TeamAdminSignUpContainer: TeamAdminSignUpContainer
};
