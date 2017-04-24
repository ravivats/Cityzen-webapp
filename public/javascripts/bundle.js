var FixedMenuTop = React.createClass({
  render : function() {
    return
      <div className="ui fixed huge secondary menu">
        <div className="item">
          <img className="ui tiny image" src="../images/logo.png">
        </div>
        <a className="item">Features</a>
        <a className="item">About Us</a>
        <div className="right menu">
          <div className="item">
            <a className="ui blue button">Log In</a>
          </div>
          <div className="item">
            <a className="ui green button">Sign Up</a>
          </div>
        </div>
      </div>;
  };
});

ReactDOM.render(<FixedMenuTop />, document.getElementById('content'));
