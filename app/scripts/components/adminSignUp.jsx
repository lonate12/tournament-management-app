var Backbone = require('backbone');
var React = require('react');
var User = require('../models/user.js').User;
var Tournament = require('../models/tournament.js').Tournament;

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

    if (e.target[4].value != e.target[5].value){
      alert("Passwords do not match, please re-enter password.")

      return;
    }

    this.state.admin.signUp(function(){
      Backbone.history.navigate('/add-tournament/', {trigger: true});
    });

  },
  componentWillMount: function(){
    this.state.admin.set('isAdmin', true);
  },
  render: function(){
    return(
      <div className="container">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <form onSubmit={this.handleAdminSubmit} className="form" id="captain-sign-up">
              <h1>Tournament Admin Sign Up</h1>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="first_name" id="first_name" placeholder="First Name" required="required"/>
                <label htmlFor="last_name">Last Name</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="last_name" id="last_name" placeholder="Last Name" required="required"/>
                <label htmlFor="phone_number">Contact Number</label>
                <input onChange={this.handleInputChangeAdmin} type="text" className="form-control" name="phone_number" id="phone_number" placeholder="(###) ###-####" required="required"/>
                <label htmlFor="email">Email</label>
                <input onChange={this.handleInputChangeAdmin} type="email" className="form-control" name="email" id="email" placeholder="Enter email" required="required"/>
                <label htmlFor="password">Password</label>
                <input onChange={this.handleInputChangeAdmin} type="password" className="form-control" name="password" id="password" placeholder="Password" required="required"/>
                <label htmlFor="password2">Re-enter Password</label>
                <input onChange={this.handleInputChangeAdmin} type="password" className="form-control" name="password2" id="password2" placeholder="Re-enter password" required="required"/>
              </div>
              <button type="submit" className="btn btn-default">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  AdminSignUpContainer: AdminSignUpContainer
};
