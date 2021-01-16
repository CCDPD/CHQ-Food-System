mapboxgl.accessToken = 'pk.eyJ1IjoiYnJlbjk2IiwiYSI6ImNqc2pkNGRvdTA0bm80OW9hOTIxNzB6NG0ifQ.tDovHyl1gFWQ96O3pok0Qg';

// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
  };
}

// Add the map to the page
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-79.41355346964089, 42.16678183056057],
  zoom: 8.5,
});

// Assign a unique id to each point.
points.features.forEach(function(point, i){
  point.properties.id = i;
});

// Wait until the map loads to make changes to the map.
map.on('load', function (e) {
    map.addLayer({
        "id": "locations",
        "type": "symbol",
        /* Add a GeoJSON source containing place coordinates and information. */
        "source": {
          "type": "geojson",
          "data": points
        },
        "layout": {
          "icon-image": "farm-15",
          "icon-allow-overlap": true,
        }
    });

    // Add to the page:
    // - The location listings on the side of the page
    // - The markers onto the map
    buildLocationList(points, map);
    addMarkers();
});

// Add a marker to the map for every point listing.
function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    points.features.forEach(function(marker) {
        // Create a div element for the marker
        var el = document.createElement('div');
        
        // Assign a unique `id` to the marker
        el.id = "marker-" + marker.properties.id;
        
        // Assign the `marker` class to each marker for styling
        el.className = 'marker';
    

    // Create a marker using the div element defined above and add it to the map
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

    // Listen to the element and when it is clicked, do three things:
    // 1. Fly to the point
    // 2. Close all other popups and display popup for clicked point
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    el.addEventListener('click', function(e){
        // Fly to the point
        flyTopoint(marker);
        
        // Close all other popups and display popup for clicked point
        createPopUp(marker);
        
        // Highlight listing in sidebar
        var activeItem = document.getElementsByClassName('active');
        e.stopPropagation();
        if (activeItem[0]) {
            activeItem[0].classList.remove('active');
        }
        var listing = document.getElementById('listing-' + marker.properties.id);
        listing.classList.add('active');
    });
  });
};

// Add a listing for each point to the sidebar.
function buildLocationList(data, map) {
    data.features.forEach(function(point, i){
        // Create a shortcut for `point.properties`, which will be used several times below.
        var prop = point.properties;

        // Add a new listing section to the sidebar
        var listings = document.getElementById('listings');
        var listing = listings.appendChild(document.createElement('div'));
        
        // Assign a unique `id` to the listing
        listing.id = "listing-" + prop.id;
        
        // Assign the `item` class to each listing for styling
        listing.className = 'item';

        // Add the link to the individual listing created above
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = "link-" + prop.id;
        link.innerHTML = prop.Organization_Street_Address;

        // Add details to the individual listing
        var details = listing.appendChild(document.createElement('div'));
        details.innerHTML = prop.Organization_City_Town + ' ' + prop.Organization_Zip_Code;

        // Listen to the element and when it is clicked, do four things:
        // 1. Update the `currentFeature` to the point associated with the clicked link
        // 2. Fly to the point
        // 3. Close all other popups and display popup for clicked point
        // 4. Highlight listing in sidebar (and remove highlight for all other listings)
        link.addEventListener('click', function(e){
          for (var i=0; i < data.features.length; i++) {
            if (this.id === "link-" + data.features[i].properties.id) {
              var clickedListing = data.features[i];
              closeNav(map);
              flyTopoint(clickedListing);
              createPopUp(clickedListing);
            }
          }
          var activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
          
        });
  });
};

// Use Mapbox GL JS's `flyTo` to move the camera smoothly a given center point.
function flyTopoint(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
};

// Create a Mapbox GL JS `Popup`.
function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
  var popup = new mapboxgl.Popup({closeOnClick: false})
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>'+ currentFeature.properties.Organization_Name +'</h3>' +
      '<h4>' + currentFeature.properties.Full_Address + '</h4>')
    .addTo(map);
};

function openTab(element){
  console.log(element);
};
