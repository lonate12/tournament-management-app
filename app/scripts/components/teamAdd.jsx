var React = require('react');

var TeamAddContainer = React.createClass({
  render: function(){
    return(
      <div className="container">
        <div className="row">
            <form className="form team-info-form col-sm-8 col-sm-offset-2">
              <h1>Register your team!</h1>
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
    );
  }
});

module.exports = {
  TeamAddContainer: TeamAddContainer
};
