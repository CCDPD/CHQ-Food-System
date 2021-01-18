mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJlbjk2IiwiYSI6ImNqc2pkNGRvdTA0bm80OW9hOTIxNzB6NG0ifQ.tDovHyl1gFWQ96O3pok0Qg";

// Add the map to the page
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-79.41355346964089, 42.16678183056057],
  zoom: 8.5,
});

// Assign a unique id to each point and clean up subsectors_joined
points.features.forEach(function (point, i) {
  point.properties.id = i;
  point.properties.Subsectors_Joined = point.properties.Subsectors_Joined.split(
    ","
  );
  for (var x = 0; x < point.properties.Subsectors_Joined.length; x++) {
    point.properties.Subsectors_Joined[x] = point.properties.Subsectors_Joined[
      x
    ].trim();
  }
});

var markerCollection = [];
map.on("load", function (e) {
  map.addLayer({
    id: "locations",
    type: "symbol",
    source: {
      type: "geojson",
      data: points,
    }
  });
  buildLocationList(points.features, map);
  addMarkers(points.features);
});

function addMarkers(data) {
  //define icon classes
  var iconClasses = {
    "Agriculture & Food Production":
      "marker sprout border border--green-light px6 py6",
    "Processing & Value-Added Products":
      "marker dolly border border--green px6 py6",
    "Aggregation, Distribution & Storage":
      "marker silo border border--blue-light px6 py6",
    "Food Retail / Direct Sales": "marker store border border--blue px6 py6",
    "Food Loss Management":
      "marker dump-truck border border--red-light px6 py6",
    "Food Assistance, Education, & Support":
      "marker school border border--red px6 py6",
  };

  // if markerCollection is not empty -> remove each marker from map -> clear collection list
  if (markerCollection != undefined){
    markerCollection.forEach(element => element.remove());
    markerCollection = []
  }

  // For each feature in the GeoJSON object
  data.forEach(function (marker) {
    // create element for marker
    var el = document.createElement("div");
    el.id = "marker-" + marker.properties.id;
    el.className = iconClasses[marker.properties.Primary_Food_System_Category];

    // create marker using element -> add to map -> add to markerCollection
    var markerFeature = new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    markerCollection.push(markerFeature);

    // add event listener to element
    el.addEventListener("click", function (e) {
      flyTopoint(marker.geometry.coordinates, 15);
      createPopUp(marker);
      highlightListing(e, marker);
    });
  });
}

// Hhghlight listing in sidebar
function highlightListing(e, marker){
  var activeItem = document.getElementsByClassName("active");
  e.stopPropagation();
  if (activeItem[0]) {
    activeItem[0].classList.remove("active");
  }
  var listing = document.getElementById("listing-" + marker.properties.id);
  listing.classList.add("active");
}

// move the camera smoothly a given center point.
function flyTopoint(coord, zoomLevel) {
  map.flyTo({
    center: coord,
    zoom: zoomLevel,
  });
}

// create popup -> add to popupCollection
var popupCollection = [];
function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName("mapboxgl-popup");
  if (popUps[0]) popUps[0].remove();
  var popup = new mapboxgl.Popup({ closeButton: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
      "<div class='txt-h4 txt-bold color-white bg-green-light px12 py12'>" +
        currentFeature.properties.Organization_Name +
        "</div>" +
        "<div class='txt-m px12 py12'>" +
        currentFeature.properties.Full_Address +
        "</div>"
    )
    .addTo(map);
  popupCollection.push(popup)
}

function resetMapView(){
  flyTopoint([-79.41355346964089, 42.16678183056057], 8.5,);
  if (popupCollection != undefined){
    popupCollection.forEach(element => element.remove());
  }
}
