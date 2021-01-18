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

// Assign a unique id to each point and clean up subsectors_joined
points.features.forEach(function(point, i){
  point.properties.id = i;
  point.properties.Subsectors_Joined = point.properties.Subsectors_Joined.split(',');
  for (var x=0; x < (point.properties.Subsectors_Joined.length); x++){
    point.properties.Subsectors_Joined[x] = point.properties.Subsectors_Joined[x].trim();
  };
});


// load mapIcons from img folder
var iconPath = 'https://raw.githubusercontent.com/bren96/CHQ-Food-System/MapboxVersion/img/icons/'
var mapIcons = [
  ['mdi-sprout','sprout.png'],
  ['mdi-dolly','dolly.png']
  ['mdi-silo','silo.png'],
  ['mid-store','store.png'],
  ['mdi-dump-truck','dump-truck.png'],
  ['mdi-school','school.png']
].forEach(
  el => map.loadImage((iconPath + el[1]), function(error, image){
    if (error) throw error;
    map.addImage(el[0], image);
  })
);

// "icon-image": [
//   'match',
//   ['get', 'Primary_Food_System_Category'],
//   'Agriculture & Food Production', 'mdi-sprout',
//   'Processing & Value-Added Products', 'mdi-dolly',
//   'Aggregation, Distribution & Storage', 'mdi-silo',
//   'Food Retail / Direct Sales', 'mid-store',
//   'Food Loss Management', 'mdi-dump-truck',
//   'Food Assistance, Education, & Support', 'mdi-school', 'farm-15'
// ],

map.on('load', function (e) {
    map.addLayer({
        "id": "locations",
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": points
        },
        "layout": {
          "icon-image": [
            'match',
            ['get', 'Primary_Food_System_Category'],
            'Agriculture & Food Production', 'mdi-sprout',
            'Processing & Value-Added Products', 'mdi-dolly',
            'Aggregation, Distribution & Storage', 'mdi-silo',
            'Food Retail / Direct Sales', 'mid-store',
            'Food Loss Management', 'mdi-dump-truck',
            'Food Assistance, Education, & Support', 'mdi-school', 'farm-15'
          ],
          "icon-allow-overlap": true,
        }
    });
    buildLocationList(points.features, map);
    addMarkers();
});

// Add a marker to the map for every point listing.
function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    points.features.forEach(function(marker) {
        // Create a div element for the marker
        var el = document.createElement('div');
        el.id = "marker-" + marker.properties.id;
        el.className = 'marker';
        
    
    // Create a marker using the div element defined above and add it to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
    el.addEventListener('click', function(e){
        flyTopoint(marker);
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


function buildLocationList(data, map) {
  // clear previous list
  var listings = document.getElementById('listings');
  listings.innerHTML = '';

  data.forEach(function(point, i){
    var prop = point.properties;

    // Add a new listing section to the sidebar
    var listing = listings.appendChild(document.createElement('div'));
    listing.id = "listing-" + prop.id;
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
      for (var i=0; i < data.length; i++) {
        if (this.id === "link-" + data[i].properties.id) {
          var clickedListing = data[i];
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
  var popup = new mapboxgl.Popup({closeButton:false})
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
      "<div class='txt-h4 txt-bold color-white bg-green-light px12 py12'>" + currentFeature.properties.Organization_Name + "</div>" +
      "<div class='txt-m px12 py12'>" + currentFeature.properties.Full_Address + "</div>"
    )
    .addTo(map);
};