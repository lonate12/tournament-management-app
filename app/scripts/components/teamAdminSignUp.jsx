var React = require('react');

var TeamAdminSignUpContainer = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
  },
  render: function(){
    return(
      <div className="container team-sign-up-component">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <h1>Sign Up Your Team!</h1>
            <form onSubmit={this.handleSubmit} className="form" id="captain-sign-up">
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
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  TeamAdminSignUpContainer: TeamAdminSignUpContainer
};
