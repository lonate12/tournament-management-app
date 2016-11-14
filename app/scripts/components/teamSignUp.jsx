var $ = require('jquery');
var React = require('react');

var TeamSignUpContainer = React.createClass({
  handleSignUp: function(e){
    e.preventDefault();
    console.log('fired');

    $('#team-info-form').slideToggle();
  },
  render: function(){
    return(
      <div className="container team-sign-up-component">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <h1>Sign Up Your Team!</h1>
            <form onSubmit={this.handleSignUp} className="form" id="captain-sign-up">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input type="text" className="form-control" id="first_name" placeholder="First Name"/>
                <label htmlFor="last_name">Last Name</label>
                <input type="text" className="form-control" id="last_name" placeholder="Last Name"/>
                <label htmlFor="email">Username</label>
                <input type="email" className="form-control" id="email" placeholder="Email"/>
                <label htmlFor="phone_number">Contact Number</label>
                <input type="text" className="form-control" id="phone_number" placeholder="(###) ###-####"/>
              </div>
              <button type="submit" className="btn btn-default">Sign Up</button>
            </form>
            <form className="form  team-info-form">
              <div className="form-group">
                <label htmlFor="name"><h3>Team Name</h3></label>
                <input type="text" className="form-control" id="name" placeholder="Team Name"/>
              </div>
              <div className="form-group">
                <h3>Primary Team Contact Info</h3>
                <label><input type="checkbox"/> I am the primary contact</label>
                <br/>
                <label htmlFor="first_name">First Name</label>
                <input type="text" className="form-control" id="first_name" placeholder="First Name"/>
                <label htmlFor="last_name">Last Name</label>
                <input type="text" className="form-control" id="last_name" placeholder="Last Name"/>
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Email"/>
                <label htmlFor="phone_number">Contact Number</label>
                <input type="text" className="form-control" id="phone_number" placeholder="(###) ###-####"/>
              </div>
              <button type="submit" className="btn btn-success">Submit Team Info</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  TeamSignUpContainer: TeamSignUpContainer
};
