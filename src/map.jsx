var React = require('react');
var DynamicForm = require('./DynamicForm');
var circleDraw = require('./helpers/circleDraw');

var Map = React.createClass({

  getInitialState: function() {
    return {
      map: null,
      location: null,
      markers: null,
      serverAddress: 'http://127.0.0.1:3000'
    }
  },

  render: function() {
    return <div id="map-container">
      <div ref="mapRef" id="map-canvas">
      </div>
    </div>
  },

  componentDidMount: function() {
    var map;

    this.getUserLocation(function(location) {
      map = this.createMap(location);
      this.setState({location: location});
      this.setState({map: map});
      this.getGlyphs(this.renderGlyphs, true);
      this.renderUserGlyph(location);
      this.renderUserLocation(map, location);
    }.bind(this));

    // Not sure this is necessary
    window.addEventListener("resize", function() {google.maps.event.trigger(map, 'resize')});

    //map event listeners go here
  },

  createMap: function(location) {
    var mapOptions = {
      draggable: true,
      zoom: 10,
      center: new google.maps.LatLng(location.latitude, location.longitude)
    }

    return new google.maps.Map(this.refs.mapRef.getDOMNode(), mapOptions);
  },

  getGlyphs: function(callback) {
    $.ajax({
      url: this.state.serverAddress + '/api/findGlyphsRadius',
      method: 'POST',
      data: JSON.stringify({
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,
        radius: 1
      }),
      contentType: "application/json",
      success: function(response) {
        callback(response.glyphs);
      }
    });
  },

  renderGlyphs: function(glyphs, infoWindow) {
    var map = this.state.map;
    // Might need to load markers into state
    glyphs.forEach(function(glyph) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(glyph.latitude, glyph.longitude),
        map: map,
        title: glyph._id
      });

      var glyphInfo = $('<div></div>');
      for (var key in glyph.data) {
        glyphInfo.append('<div>' + key + ': ' + glyph.data[key] + '</div>');
      }

      var hoverWindow = new google.maps.InfoWindow({
        content: glyphInfo[0]
      });

      marker.addListener('mouseover', function() {
        hoverWindow.open(map, marker);
      });

      marker.addListener('mouseout', function() {
        hoverWindow.close(map, marker);
      });

    }.bind(this));
  },

  getUserLocation: function(callback) {
    navigator.geolocation.getCurrentPosition(function(location) {
      callback(location.coords);
    });
  },

  renderUserLocation: function(map, location) {
    // Append the users location as a circle to the map
    var userLocationDot = new google.maps.Circle({
      strokeOpacity: 0,
      fillOpacity: 1,
      fillColor: 'blue',
      map: map,
      center: {lat: location.latitude, lng: location.longitude},
      radius: 700
    });

    // Another circle that animates a "pulse"
    var userLocationPulse = new google.maps.Circle({
      strokeColor: 'LightBlue',
      strokeWeight: 2,
      fillOpacity: 0,
      map: map,
      center: {lat: location.latitude, lng: location.longitude},
      radius: 700
    });

    // Helper functions that animate the circles and update their
    // rendering when the zoom of the map is changed
    circleDraw.radiusOnZoom(map, userLocationDot);
    circleDraw.animateOnZoom(map, userLocationPulse);
  },

  createGlyph: function(latitude, longitude, data, callback) {
    $.ajax.call(this, {
      url: this.state.serverAddress + '/api/createGlyph',
      method: 'POST',
      data: JSON.stringify({
        latitude: latitude || this.state.location.latitude,
        longitude: longitude || this.state.location.longitude,
        data: data || {
          name: 'test name'
        }
      }),
      contentType: "application/json",
      success: callback
    });
  },

  renderUserGlyph: function(location) {
    var map = this.state.map;

    var latitude = location.latitude;
    var longitude = location.longitude;


    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      animation: google.maps.Animation.BOUNCE,
      draggable: true,
      title: 'Give me a better name!'
    });

    var dataInput = new DynamicForm();

    var createGlyphButton = $('<div class="data-input"><div id="save-glyph-button"> Save glyph! </div></div>')[0];
    var clickWindow = new google.maps.InfoWindow({
      // We can put any DOM node here.
      content: createGlyphButton
    });

    marker.addListener('dragend', function(dragData) {
      latitude = dragData.latLng.H;
      longitude = dragData.latLng.L;
    });

    marker.addListener('click', function() {
      clickWindow.open(map, marker);
      dataInput.render('.data-input');
      $('#save-glyph-button').on('click', function() {
        this.createGlyph(latitude, longitude, dataInput.data());
      }.bind(this));
    }.bind(this));
  } 
});

module.exports = Map;
