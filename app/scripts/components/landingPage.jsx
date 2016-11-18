var React = require('react');

var LandingPage = React.createClass({
  render: function(){
    return(
      <ul>
        <li><a href="#/sign-up/">1. Admin Sign Up</a></li>
        <li><a href="#/add-tournament/">2. Admin Add Tournament</a></li>
        <li><a href="#/login/">3. Admin Login</a></li>
        <li><a href="#/tournaments/">4. Tournament List</a></li>
        <li><a href="#/tournaments/J0puxomGRv/">5. Tournament Dashboard</a></li>
        <li><a href="#/tournaments/J0puxomGRv/LQGVGwJWib/">6. Team Dashboard</a></li>
        <li><a href="#/tournaments/J0puxomGRv/login/">7. Team Admin Login</a></li>
        <li><a href="#/tournaments/J0puxomGRv/add-team/">8. Team Admin Add Team</a></li>
        <li><a href="#/tournaments/J0puxomGRv/sign-up/">9. Team Admin Sign Up</a></li>
        <li><a href="#/tournaments/J0puxomGRv/admin/">9. Tournament Admin Dash</a></li>
      </ul>
    );
  }
});

module.exports = {
  LandingPage: LandingPage
};
