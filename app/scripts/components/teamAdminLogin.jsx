var React = require('react');
var User = require('../models/user.js').User;

var TeamAdminLoginContainer = React.createClass({
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
    this.state.currentUser.login(this.state.username, this.state.password);

    this.setState({username: '', password: ''})
  },
  render: function(){
    return(
      <div className="container">
        <div className="row">
          <form onSubmit={this.handleSubmit} className="col-sm-8 col-sm-offset-2">
            <h1>Login</h1>
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input onChange={this.handleInput} type="email" value={this.state.username} className="form-control" name="username" id="username" placeholder="Enter email"/>
              <label htmlFor="password">Password</label>
              <input onChange={this.handleInput} type="password" value={this.state.password} className="form-control" name="password" id="password" placeholder="Password"/>
            </div>
            <button type="submit" className="btn btn-default">Login</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = {
  TeamAdminLoginContainer: TeamAdminLoginContainer
};
