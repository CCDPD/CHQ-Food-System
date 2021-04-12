mapboxgl.accessToken = "pk.eyJ1IjoiYnJlbjk2IiwiYSI6ImNqc2pkNGRvdTA0bm80OW9hOTIxNzB6NG0ifQ.tDovHyl1gFWQ96O3pok0Qg";

// convert points JSON to geoJSON
geojsonCollection = {
  "type": "FeatureCollection",
  "features" : []
}
points.forEach(function(point, i) {

  // build feature geom and properties
  geojsonFeature = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [point.long, point.lat]
    },
    "properties" : {
      "id": i,
      "organizationName": point.organizationName,
      "organizationStreetAddress": point.organizationStreetAddress,
      "organizationCitytown": point.organizationCitytown,
      "organizationZipCode": point.organizationZipCode,
      "organizationState": point.organizationState,
      "fullAddress": point.fullAddress,
      "organizationPhoneNumber": point.organizationPhoneNumber,
      "organizationWebsite": point.organizationWebsite,
      "organizationSocialMedia": point.organizationSocialMedia,
      "ifYouWouldLikeToProvideABriefDescriptionOfYourOrganizationPleaseIncludeItInTheSpaceBelow": point.ifYouWouldLikeToProvideABriefDescriptionOfYourOrganizationPleaseIncludeItInTheSpaceBelow,
      "pleaseIndicateAnyCertificationsHeldByYourOrganization": point.pleaseIndicateAnyCertificationsHeldByYourOrganization,
      "primaryFoodSystemCategory": point.primaryFoodSystemCategory,
      "agricultureFoodProductionType": point.agricultureFoodProductionType,
      "processingValueaddedProductsType": point.processingValueaddedProductsType,
      "aggregationDistributionStorageType": point.aggregationDistributionStorageType,
      "foodOutletType": point.foodOutletType,
      "foodAssistanceEducationSupportType": point.foodAssistanceEducationSupportType,
      "foodLossManagementType" : point.foodLossManagementType,
      "pleaseIndicateWhatPaymentMethodsYouAccept": point.pleaseIndicateWhatPaymentMethodsYouAccept,
      "additionalFoodSystemCategories":point.additionalFoodSystemCategories,
      "subsectorsJoined": point.subsectorsJoined,
    }
  }

  // clean up subsectorsJoined
  geojsonFeature.properties.subsectorsJoined = geojsonFeature.properties.subsectorsJoined.split(",");
  for (var x = 0; x < geojsonFeature.properties.subsectorsJoined.length; x++) {
    geojsonFeature.properties.subsectorsJoined[x] = geojsonFeature.properties.subsectorsJoined[x].trim();
  };

  // check for missing properites -> if missing set to ""
  Object.keys(geojsonFeature.properties).forEach(function(prop){
    if (geojsonFeature.properties.prop == undefined){
      geojsonFeature.properties.prop = "";
    };
  });

  // add feature to feature collection
  geojsonCollection.features.push(geojsonFeature);

});

// set points var to feature collection
points = geojsonCollection;

// get point's sub sectors as list
function getSubSectorData(points){
  actualSectors = []
  points.features.forEach( function(point) {
    point.properties.subsectorsJoined.forEach( function(subsector){
      if (actualSectors.includes(subsector)){} else {
        actualSectors.push(subsector)
      }
    })
  })
  return actualSectors
}

// remove unused subsectors from sectors
usedSubsectors = getSubSectorData(points)
Object.keys(sectors).forEach(function(sector){
  sectors[sector].sub_sectors = sectors[sector].sub_sectors.filter(subsector => usedSubsectors.includes(subsector));
})

// set map bounds
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
    el.className = iconClasses[marker.properties.primaryFoodSystemCategory];

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
  currentFeature.properties.organizationName + "</div>");

  // determine what content to add to popup
  var popupHTMLClasses = {
    "organizationWebsite" : [
      "<div class='grid px12 py6'>",
      "<div class='col col--2'>",
      "<svg class='icon h24 w24'>",
      "<use xlink:href='#icon-globe'/>",
      "</svg>",
      "</div>",
      "<div class='col col--10 txt-break-word mt3'>",
      "<a class='link' href='https://",
      currentFeature.properties.organizationWebsite, 
      "'>",
      testURL('https://' + currentFeature.properties.organizationWebsite),
      "</a>",
      "</div>",
      "</div>"
    ],
    "organizationPhoneNumber" : [
      "<div class='grid px12 py6'>",
      "<div class='col col--2'>",
      "<svg class='icon h24 w24'>",
      "<use xlink:href='#icon-mobile'/>",
      "</svg>",
      "</div>",
      "<div class='col col--10 txt-break-word mt3'>",
      "<a class='link' href='tel:",
      currentFeature.properties.organizationPhoneNumber, 
      "'>",
      '+' + currentFeature.properties.organizationPhoneNumber,
      "</a>",
      "</div>",
      "</div>"
    ],
    "organizationSocialMedia" : [
      "<div class='grid px12 py6'>",
      "<div class='col col--2'>",
      "<svg class='icon h24 w24'>",
      "<use xlink:href='#icon-instagram'/>",
      "</svg>",
      "</div>",
      "<div class='col col--10 txt-break-word mt3'>",
      "<a class='link' href='https://",
      currentFeature.properties.organizationSocialMedia, 
      "'>",
      testURL('https://' + currentFeature.properties.organizationSocialMedia),
      "</a>",
      "</div>",
      "</div>"
    ],
    "ifYouWouldLikeToProvideABriefDescriptionOfYourOrganizationPleaseIncludeItInTheSpaceBelow" : [
      "<div class='txt-bold px12 py12'>Description:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.ifYouWouldLikeToProvideABriefDescriptionOfYourOrganizationPleaseIncludeItInTheSpaceBelow, 
      '</div>'
    ],
    "pleaseIndicateAnyCertificationsHeldByYourOrganization" : [
      "<div class='txt-bold px12 py12'>Certifications:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.pleaseIndicateAnyCertificationsHeldByYourOrganization, 
      '</div>'
    ],
    "pleaseIndicateWhatPaymentMethodsYouAccept" : [
      "<div class='txt-bold px12 py12'>Payment Methods:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.pleaseIndicateWhatPaymentMethodsYouAccept, 
      '</div>'
    ],
    "primaryFoodSystemCategory" : [
      "<div class='txt-bold px12 py12'>Primary Sector:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.primaryFoodSystemCategory, 
      '</div>'
    ],
    "agricultureFoodProductionType": [
      "<div class='txt-bold px12 py12'>Agriculture & Food Production Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.agricultureFoodProductionType, 
      '</div>'
    ],
    "processingValueaddedProductsType": [
      "<div class='txt-bold px12 py12'>Processing & Value-Added Products Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.processingValueaddedProductsType, 
      '</div>'
    ],
    "aggregationDistributionStorageType": [
      "<div class='txt-bold px12 py12'>Aggregation, Distribution, & Storage Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.aggregationDistributionStorageType, 
      '</div>'
    ],
    "foodOutletType": [
      "<div class='txt-bold px12 py12'>Food Retail / Direct Sales Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.foodOutletType, 
      '</div>'
    ],
    "foodLossManagementType": [
      "<div class='txt-bold px12 py12'>Food Loss Management Sub-Sectors:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.foodLossManagementType, 
      '</div>'
    ],
    "foodAssistanceEducationSupportType": [
      "<div class='txt-bold px12 py12'>Food Assistance, Education, & Support:</div>",
      "<div class='txt-s px12 pb3'>",
      currentFeature.properties.foodAssistanceEducationSupportType, 
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
      "<div id='popupContent' class='scroll-auto py6 hmax180 hmax360-ml hmax360-mxl'>" +
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
  map.fitBounds(countyBounds);
  if (popupCollection != undefined){
    popupCollection.forEach(element => element.remove());
  }
}
