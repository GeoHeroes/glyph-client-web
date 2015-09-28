var React = require('react');

var FormElement = React.createClass({
  getInitialState: function() {
    return {
      fields: [{label: 'Message'}]
    }
  },

  render: function() {
    return ( 
      <div>{this.props.label}: <input type="text"/></div>
    );
  }
});

module.exports = FormElement;