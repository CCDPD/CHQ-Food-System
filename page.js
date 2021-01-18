var navIcons = document.getElementsByClassName("navIcons");
for (var i = 0; i < navIcons.length; i++) {
  navIcons[i].addEventListener("click", function () {
    openTab(this);
  });
}

function removeActive(elements, activeName) {
  // toggle elements active class
  for (var i = 0; i < elements.length; i++) {
    var elementClasses = elements[i].classList;
    for (var x = 0; x < elementClasses.length; x++) {
      if (elementClasses[x] == activeName) {
        elementClasses.remove(activeName);
        break;
      }
    }
  }
}

function openTab(element) {
  // toggle navIcons
  var navIcons = document.getElementsByClassName("navIcons");
  removeActive(navIcons, "active-navIcon");
  element.classList.add("active-navIcon");

  // toggle tabDivs
  var tabDivs = document.getElementsByClassName("tabContent");
  removeActive(tabDivs, "active-tabContent");
  var contentID = element.id + "Content";
  document.getElementById(contentID).classList.add("active-tabContent");

  // reset map view
  resetMapView();
}

function filterSubSector(subSectorValue, action) {
  // update filter based on request -> set filter -> built location list -> add markers
  currentFilter = map.getFilter("locations");

  // update filter
  if (action == "ADD") {
    // if there is no filter -> set one
    if (currentFilter == null) {
      var filter = [
        "any",
        ["in", subSectorValue, ["get", "Subsectors_Joined"]],
      ];
    } else {
      currentFilter.push(["in", subSectorValue, ["get", "Subsectors_Joined"]]);
      var filter = currentFilter;
    }
  } else if(action == "REMOVE") {
    // go thru filters, skip fist value 'any' -> remove requested subsector from filter
    for (x = 1; currentFilter.length; x++) {
      var filterValue = currentFilter[x][1];
      if (filterValue == subSectorValue) {
        currentFilter.splice(x, 1);
        if (currentFilter.length == 1) {
          currentFilter = null;
        }
        var filter = currentFilter;
        break;
      }
    }
  }

  // set filter
  map.setFilter("locations", filter);

  // build location list
  if (map.getFilter("locations") == null) {
    // if there is no filter -> get all features
    var features = map.getSource("locations")._data.features;
  } else {
    // go thru each feature -> if any conditions are true return feature to list
    var subSectorFilter = filter.slice(1).map((element) => element[1]);
    var features = map
      .getSource("locations")
      ._data.features.filter((x) =>
        subSectorFilter.some((y) => x.properties.Subsectors_Joined.includes(y))
      );
    }
    buildLocationList(features, map);

    // add makers
    addMarkers(features);
}

function toggleSubSector(element) {
  var action = "REMOVE";
  for (var x = 0; x < element.classList.length; x++) {
    // if class is btn--stroke -> set action to add and remove class
    if (element.classList[x] == "btn--stroke") {
      action = "ADD";
      element.classList.remove("btn--stroke");
      break;
    }
  }
  // if action still is REMOVE -> add the btn--stroke class
  if (action == "REMOVE") {
    element.classList.add("btn--stroke");
  }
  filterSubSector(element.innerText, action);
}

function primarySectorChange() {
  // reset map view
  resetMapView();
  map.setFilter('locations', null)
  addMarkers(points.features)

  // get selection
  selectedSector = document.getElementById("PrimarySector").value;

  // clear div
  subSectorDiv = document.getElementById("subSectorsDiv");
  subSectorDiv.innerHTML = "";

  // if All is selected ->
  if (selectedSector == "All") {
  } else {
    // if All is not selected
    // build heading
    subSectorDiv.innerHTML = "<br>";
    var subSectorHeading = document.createElement("div");
    subSectorHeading.classList.add("txt-bold");
    subSectorHeading.innerText = "Sub-Sectors:";
    subSectorDiv.appendChild(subSectorHeading);

    // generate subsectors
    subSectorList = sectors[selectedSector]["sub_sectors"];
    for (subSector in subSectorList) {
      var sectorButton = document.createElement("button");
      sectorButton.classList.add("btn", "btn--stroke", "btn--green", "mx3", "my3");
      sectorButton.textContent = subSectorList[subSector];
      sectorButton.addEventListener("click", function () {
        toggleSubSector(this);
      });
      subSectorDiv.appendChild(sectorButton);
    }
  }
}

function buildLocationList(data, map) {
  // clear previous list
  var listings = document.getElementById("listings");
  listings.innerHTML = "";

  data.forEach(function (point, i) {
    var prop = point.properties;

    // Add a new listing section to the sidebar
    var listing = listings.appendChild(document.createElement("div"));
    listing.id = "listing-" + prop.id;
    listing.className = "item";

    // Add the link to the individual listing created above
    var link = listing.appendChild(document.createElement("a"));
    link.href = "#";
    link.className = "title";
    link.id = "link-" + prop.id;
    link.innerHTML = prop.Organization_Street_Address;

    // Add details to the individual listing
    var details = listing.appendChild(document.createElement("div"));
    details.innerHTML =
      prop.Organization_City_Town + " " + prop.Organization_Zip_Code;

    // Listen to the element and when it is clicked, do four things:
    // 1. Update the `currentFeature` to the point associated with the clicked link
    // 2. Fly to the point
    // 3. Close all other popups and display popup for clicked point
    // 4. Highlight listing in sidebar (and remove highlight for all other listings)
    link.addEventListener("click", function (e) {
      for (var i = 0; i < data.length; i++) {
        if (this.id === "link-" + data[i].properties.id) {
          var clickedListing = data[i];
          flyTopoint(clickedListing.geometry.coordinates, 15);
          createPopUp(clickedListing);
        }
      }
      var activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.toggle("active");
      }
      this.parentNode.classList.add("active");
    });
  });
}

function refreshSelection(){
  map.setFilter('locations',null);
  addMarkers(points.features);
  var subSectorDiv = document.getElementById('subSectorsDiv');
  var subSectorBtns = subSectorDiv.getElementsByClassName('btn');
  for (var i=0; i<subSectorBtns.length; i++){
    if (!('btn--stroke' in subSectorBtns[i].classList)){
      subSectorBtns[i].classList.add('btn--stroke');
    }
  }
  resetMapView();
}

