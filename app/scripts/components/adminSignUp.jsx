var React = require('react');
var User = require('../models/user.js').User;
var Tournament = require('../models/tournament.js').Tournament;

var AdminSignUpContainer = React.createClass({
  getInitialState: function(){
    var admin = new User(), tournament = new Tournament();
    return{
      'admin': admin,
      'tournament': tournament,
      'first_name': '',
      'last_name': '',
      'email': '',
      'phone_number': '',
      'username': '',
      'password': '',
      'tournament_name': '',
      'start_date': '',
      'end_date': '',
      'city': '',
      'state': ''
    };
  },
  handleInputChange: function(e){
    e.preventDefault();
    var target = e.target;

    var newState = {};
    newState[target.name] = target.value;

    this.state.admin.set(target.name, target.value);
    this.state.admin.set('username', this.state.admin.get('email'));
    this.setState({admin: this.state.admin});
  },
  handleAdminSubmit: function(e){
    e.preventDefault();
    console.log(this.state.admin);
    this.state.admin.signUp();
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
                <input onChange={this.handleInputChange} type="text" className="form-control" name="first_name" id="first_name" placeholder="First Name"/>
                <label htmlFor="last_name">Last Name</label>
                <input onChange={this.handleInputChange} type="text" className="form-control" name="last_name" id="last_name" placeholder="Last Name"/>
                <label htmlFor="phone_number">Contact Number</label>
                <input onChange={this.handleInputChange} type="text" className="form-control" name="phone_number" id="phone_number" placeholder="(###) ###-####"/>
                <label htmlFor="email">Email</label>
                <input onChange={this.handleInputChange} type="email" className="form-control" name="email" id="email" placeholder="Enter email"/>
                <label htmlFor="password">Password</label>
                <input onChange={this.handleInputChange} type="password" className="form-control" name="password" id="password" placeholder="Password"/>
              </div>
              <button type="submit" className="btn btn-default">Sign Up</button>
            </form>
            <form className="form" id="captain-sign-up">
              <h1>Create Your Tournament</h1>
              <div className="form-group">
                <label htmlFor="tournament_name">Tournament Name</label>
                <input onChange={this.handleInputChange} type="text" className="form-control" name="tournament_name" id="tournament_name" placeholder="Tournament Name"/>
                <label htmlFor="start_date">Start Date</label>
                <input onChange={this.handleInputChange} type="date" className="form-control" name="start_date" id="start_date"/>
                <label htmlFor="end_date">End Date</label>
                <input onChange={this.handleInputChange} type="date" className="form-control" name="end_date" id="end_date"/>
                <label htmlFor="city">Tournament City</label>
                <input onChange={this.handleInputChange} type="text" className="form-control" name="city" id="city" placeholder="Clemson"/>
                <label htmlFor="state">Tournament State</label>
                <select onChange={this.handleInputChange} className="form-control" name="state" id="state">
                  <option value="AL">Alabama</option>
                	<option value="AK">Alaska</option>
                	<option value="AZ">Arizona</option>
                	<option value="AR">Arkansas</option>
                	<option value="CA">California</option>
                	<option value="CO">Colorado</option>
                	<option value="CT">Connecticut</option>
                	<option value="DE">Delaware</option>
                	<option value="DC">District Of Columbia</option>
                	<option value="FL">Florida</option>
                	<option value="GA">Georgia</option>
                	<option value="HI">Hawaii</option>
                	<option value="ID">Idaho</option>
                	<option value="IL">Illinois</option>
                	<option value="IN">Indiana</option>
                	<option value="IA">Iowa</option>
                	<option value="KS">Kansas</option>
                	<option value="KY">Kentucky</option>
                	<option value="LA">Louisiana</option>
                	<option value="ME">Maine</option>
                	<option value="MD">Maryland</option>
                	<option value="MA">Massachusetts</option>
                	<option value="MI">Michigan</option>
                	<option value="MN">Minnesota</option>
                	<option value="MS">Mississippi</option>
                	<option value="MO">Missouri</option>
                	<option value="MT">Montana</option>
                	<option value="NE">Nebraska</option>
                	<option value="NV">Nevada</option>
                	<option value="NH">New Hampshire</option>
                	<option value="NJ">New Jersey</option>
                	<option value="NM">New Mexico</option>
                	<option value="NY">New York</option>
                	<option value="NC">North Carolina</option>
                	<option value="ND">North Dakota</option>
                	<option value="OH">Ohio</option>
                	<option value="OK">Oklahoma</option>
                	<option value="OR">Oregon</option>
                	<option value="PA">Pennsylvania</option>
                	<option value="RI">Rhode Island</option>
                	<option value="SC">South Carolina</option>
                	<option value="SD">South Dakota</option>
                	<option value="TN">Tennessee</option>
                	<option value="TX">Texas</option>
                	<option value="UT">Utah</option>
                	<option value="VT">Vermont</option>
                	<option value="VA">Virginia</option>
                	<option value="WA">Washington</option>
                	<option value="WV">West Virginia</option>
                	<option value="WI">Wisconsin</option>
                	<option value="WY">Wyoming</option>
                </select>
              </div>
              <button type="submit" className="btn btn-default">Create Tournament</button>
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
