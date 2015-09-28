var React = require('react');
var Map = require('./map');
var Modal = require('boron/DropModal');

var App = React.createClass({
  showModal: function() {
    this.refs.modal.show();
  },

  componentDidMount: function() {
    // this.showModal();
  },

  render: function() {
    return <div>
      <h1 className="red">
        GlyphBase!
      </h1>
      <Map latitude={25} longitude={25}></Map>
      <Modal ref="modal" id="modal">
        <h1>Hello World!</h1>
      </Modal>
    </div>
  }
});

var element = React.createElement(App, {});
React.render(element, document.querySelector('#container'));
