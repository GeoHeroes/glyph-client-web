var React = require('react');
var Map = require('./map');

var App = React.createClass({
  render: function() {
    return <div>
      <h1 className="red">
        GlyphBase!
      </h1>
      <Map latitude={25} longitude={25}></Map>
    </div>
  }
});

var element = React.createElement(App, {});
React.render(element, document.querySelector('#container'));
