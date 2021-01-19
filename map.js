mapboxgl.accessToken = "pk.eyJ1IjoiYnJlbjk2IiwiYSI6ImNqc2pkNGRvdTA0bm80OW9hOTIxNzB6NG0ifQ.tDovHyl1gFWQ96O3pok0Qg";
  
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

var countyBounds = new mapboxgl.LngLatBounds(
  new mapboxgl.LngLat(-79.8754852889,41.9311113451),
  new mapboxgl.LngLat(-78.919674742,42.5947626407),
);

// Add the map to the page
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [-79.41355346964089, 42.16678183056057],
  zoom: 8.5,
  bounds: countyBounds
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
  
  // create popup heading
  var popupHeader = ("<div class='txt-h4 txt-bold color-white bg-green px12 py12'>" +
  currentFeature.properties.Organization_Name + "</div>");

  // determine what content to add to popup
  var popupHTMLClasses = {
    "Organization_Website" : [
      "<div class='grid px12 py6'>",
      "<div class='col col--2'>",
      "<svg class='icon h24 w24'>",
      "<use xlink:href='#icon-globe'/>",
      "</svg>",
      "</div>",
      "<div class='col col--10 txt-break-word mt3'>",
      "<a class='link' href='",
      currentFeature.properties['Organization_Website'], 
      "'>",
      testURL(currentFeature.properties['Organization_Website']),
      "</a>",
      "</div>",
      "</div>"
    ],
    "Organization_Phone_Number" : [
      "<div class='grid px12 py6'>",
      "<div class='col col--2'>",
      "<svg class='icon h24 w24'>",
      "<use xlink:href='#icon-mobile'/>",
      "</svg>",
      "</div>",
      "<div class='col col--10 txt-break-word mt3'>",
      "<a class='link' href='tel:",
      currentFeature.properties['Organization_Phone_Number'], 
      "'>",
      '+' + currentFeature.properties['Organization_Phone_Number'],
      "</a>",
      "</div>",
      "</div>"
    ],
    "Organization_Social_Media" : [
      "<div class='grid px12 py6'>",
      "<div class='col col--2'>",
      "<svg class='icon h24 w24'>",
      "<use xlink:href='#icon-instagram'/>",
      "</svg>",
      "</div>",
      "<div class='col col--10 txt-break-word mt3'>",
      "<a class='link' href='",
      currentFeature.properties['Organization_Social_Media'], 
      "'>",
      testURL(currentFeature.properties['Organization_Social_Media']),
      "</a>",
      "</div>",
      "</div>"
    ],
    "If_you_would_like_to_provide_a_" : [
      "<div class='txt-bold px12 py12'>Description:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['If_you_would_like_to_provide_a_'], 
      '</div>'
    ],
    "Please_indicate_any_certificati" : [
      "<div class='txt-bold px12 py12'>Certifications:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Please_indicate_any_certificati'], 
      '</div>'
    ],
    "Primary_Food_System_Category" : [
      "<div class='txt-bold px12 py12'>Primary Sector:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Primary_Food_System_Category'], 
      '</div>'
    ],
    "Agriculture___Food_Production_T": [
      "<div class='txt-bold px12 py12'>Agriculture & Food Production Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Agriculture___Food_Production_T'], 
      '</div>'
    ],
    "Processing___Value_Added_Produc": [
      "<div class='txt-bold px12 py12'>Processing & Value-Added Products Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Processing___Value_Added_Produc'], 
      '</div>'
    ],
    "Aggregation__Distribution____St": [
      "<div class='txt-bold px12 py12'>Aggregation, Distribution, & Storage Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Aggregation__Distribution____St'], 
      '</div>'
    ],
    "Food_Outlet_Type": [
      "<div class='txt-bold px12 py12'>Food Retail / Direct Sales Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Food_Outlet_Type'], 
      '</div>'
    ],
    "Food_Loss_Management_Type": [
      "<div class='txt-bold px12 py12'>Food Loss Management Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Food_Loss_Management_Type'], 
      '</div>'
    ],
    "Food_Assistance__Education____S": [
      "<div class='txt-bold px12 py12'>Food Assistance, Education, & Support:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties['Food_Assistance__Education____S'], 
      '</div>'
    ],
  };
  var popupHTML = "";
  for (popupClass in popupHTMLClasses){
    // check if value is null
    if (currentFeature.properties[popupClass] != null){
      popupHTML += popupHTMLClasses[popupClass].join('');
    }
  }

  var popup = new mapboxgl.Popup({ closeButton: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
      popupHeader + 
      "<div id='popupContent' class='scroll-auto hmax180 hmax360-ml hmax360-mxl'>" +
      popupHTML +
      '</div>'
    )
    .addTo(map);
  popupCollection.push(popup)
}

function testURL(url){
  try {
    var urlHost = new URL(url).hostname
  }
  catch(err) {
    var urlHost = null
  }
  return urlHost
}

function resetMapView(){
  // flyTopoint([-79.41355346964089, 42.16678183056057], 8.5,);
  map.fitBounds(countyBounds);
  if (popupCollection != undefined){
    popupCollection.forEach(element => element.remove());
  }
}
