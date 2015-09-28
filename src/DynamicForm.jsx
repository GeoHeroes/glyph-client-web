var React = require('react/addons');
var FormElement = require('./FormElement');
var update = React.addons.update;

var DynamicForm = React.createClass({
  getInitialState: function() {
    return {
      currentLabel: '',
      fields: [{label: 'Message'}]
    }
  },

  addField: function() {
    var fields = this.state.fields.slice();
    fields.push({label: this.state.currentLabel});
    this.setState({fields: fields});
  },

  updateCurrentLabel: function(labelUpdateEvent) {
    this.setState({
      currentLabel: labelUpdateEvent.target.value
    });
  },

  handleFormChange: function(event) {
    var label = event.target.name;
    var value = event.target.value;
    var newState = {};
    newState[label] = value;
    this.setState(newState);
    console.log(this.state);
  },

  submitGlyph: function(event) {
    var glyphData = {};
    var state = this.state;
    for (var key in state) {
      if (key === 'currentLabel' || key === 'fields') {
        continue;
      }
      glyphData[key] = state[key];
    }

    $.ajax.call(this, {
      url: 'http://ec2-52-11-76-55.us-west-2.compute.amazonaws.com' + '/api/createGlyph',
      method: 'POST',
      data: JSON.stringify({
        latitude: this.props.coordinates.latitude,
        longitude: this.props.coordinates.longitude,
        data: glyphData
      }),
      contentType: "application/json",
      // success: callback
    });
  },

  render: function() {
    return ( 
      <div>
        <button onClick={this.addField}>Add field!</button>
        <input onChange={this.updateCurrentLabel} type="text"></input>
          {this.state.fields.map(function(field, index) {
            return (
              <div>
                {field.label}:
                <input key={index} name={field.label} type="text" onChange={this.handleFormChange}></input>
              </div>
            )
          }.bind(this))}
        <button onClick={this.submitGlyph}>Submit Glyph!</button>
      </div>
    );
  }
});

module.exports = DynamicForm;
