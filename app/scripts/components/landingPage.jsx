var React = require('react');

var LandingPage = React.createClass({
  render: function(){
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="hero col-sm-12">
            <img className="hero-logo img-responsive" src="images/the-standings-logo-white-shadow.png" alt="The Standings Logo" />
            <h1 className="hero-sub-header">Helping manage tournaments since 2016</h1>
        </div>
        </div>
        <div className="main-bg row">
          <h2 className="accent text-center" id="landing-prompt">What brings you by today{'?'}</h2>
          <div className="col-md-4">
            <a href="#/tournaments/">
              <div className="tile col-md-12">
                <h3>I{"'"}m a <span className="accent">guest or player</span> looking tournament info</h3>
                <i className="fa fa-user tile-icon" aria-hidden="true"></i>
              </div>
            </a>
          </div>
          <div className="col-md-4">
            <a href="#/tournaments/">
              <div className="tile col-md-12">
                <h3>I{"'"}m a <span className="accent">team manager</span> looking to sign up a team</h3>
                <i className="fa fa-users tile-icon" aria-hidden="true"></i>
              </div>
            </a>
          </div>
          <div className="col-md-4">
            <a href="#/login/">
              <div className="tile col-md-12">
                <h3>I{"'"}m a <span className="accent">tournament administrator</span> on The Standings</h3>
                <i className="fa fa-lock tile-icon" aria-hidden="true"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = {
  LandingPage: LandingPage
};
