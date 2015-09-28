function animateOnZoom(map, circle) {
  var minRadius = circle.getRadius();
  var maxRadius = minRadius*1.2;
  var lastZoom = map.getZoom();
  var direction = 1;
  var step = 10;

  function circleTweener() {
    var radius = circle.getRadius();
    if (radius < minRadius || radius > maxRadius) {
      direction *= -1;
    }
    circle.setRadius(radius + (direction * step)); 
  }

  var tweenInterval = setInterval(function() {
    circleTweener();
  }, 50);

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var newZoom = map.getZoom();

    if (newZoom > lastZoom) {
      maxRadius /= 2;
      minRadius /=2;
      step /= 2;
    } else {
      maxRadius *= 2;
      minRadius *= 2;
      step *= 2;
    }

    lastZoom = newZoom;
    circle.setRadius(maxRadius);
  });
}

function radiusOnZoom(map, circle) {
  var lastZoom = map.getZoom();
  var radius = circle.getRadius();

  google.maps.event.addListener(map, 'zoom_changed', function() {
    var newZoom = map.getZoom();

    if (newZoom > lastZoom) {
      radius /= 2;
    } else {
      radius *=2;
    }

    lastZoom = newZoom;
    circle.setRadius(radius);
  });
}

exports.animateOnZoom = animateOnZoom;
exports.radiusOnZoom = radiusOnZoom;