function removeActive(elements, activeName){
    // toggle elements active class
    for (var i=0; i<elements.length; i++){
      var elementClasses = elements[i].classList;
      for (var x=0; x<elementClasses.length; x++){
        if (elementClasses[x] == activeName){
          elementClasses.remove(activeName);
          break
        };
      };
    };
  };
  
  
function openTab(element){
    // toggle navIcons
    var navIcons = document.getElementsByClassName('navIcons');
    removeActive(navIcons, 'active-navIcon');
    element.classList.add("active-navIcon");

    // toggle tabDivs
    var tabDivs = document.getElementsByClassName('tabContent');
    removeActive(tabDivs, 'active-tabContent')
    var contentID = (element.id + 'Content');
    document.getElementById(contentID).classList.add('active-tabContent')
    };

    var navIcons = document.getElementsByClassName('navIcons');
    for (var i=0; i<navIcons.length; i++){
    navIcons[i].addEventListener('click', function(){
        openTab(this);
    });
};


function filterSubSector(subSectorValue, action){
    currentFilter = map.getFilter('locations');
    if (action == 'ADD'){
        // if there is no filter -> set one
        if (currentFilter == null){
            var filter = ['any', ['in', subSectorValue, ['get', 'Subsectors_Joined']]];
        } else {
            currentFilter.push(['in', subSectorValue, ['get', 'Subsectors_Joined']]);
            var filter = currentFilter;
        };
    } else {
        // go thru filters, skip fist value 'any'
        for (x=1; currentFilter.length; x++){
            var filterValue = currentFilter[x][1];
            if (filterValue == subSectorValue){
                currentFilter.splice(x,1);
                if (currentFilter.length == 1){currentFilter = null}
                var filter = currentFilter;
                break
            };
        };
    };
    map.setFilter('locations', filter);
    // if there is no filter -> build entire location list
    if (map.getFilter('locations') == null){
      var features = map.getSource('locations')._data.features;
      buildLocationList(features, map);
    } else {
      // go thru each feature -> if any conditions are true return feature to list
      var subSectorFilter =  filter.slice(1).map(element => element[1]);
      var features = map.getSource('locations')._data.features.filter(
        x => subSectorFilter.some( y => x.properties.Subsectors_Joined.includes(y))
      );
      buildLocationList(features, map);
    };
};


function toggleSubSector(element){
    var action = 'REMOVE';
    for (var x=0; x<element.classList.length; x++){
        // if class is btn--stroke -> set action to add and remove class
        if (element.classList[x] == 'btn--stroke'){
            action = 'ADD';
            element.classList.remove('btn--stroke');
            break
        };
    };
    // if action still is REMOVE -> add the btn--stroke class
    if (action == 'REMOVE'){ element.classList.add('btn--stroke')};
    filterSubSector(element.innerText, action);
};


function primarySectorChange(){
    // get selection
    selectedSector = document.getElementById("PrimarySector").value;
  
    // clear div
    subSectorDiv = document.getElementById('subSectorsDiv');
    subSectorDiv.innerHTML = '';
  
    // if All is selected ->
    if (selectedSector == 'All'){
  
    } else {
      // if All is not selected
      // build heading
      subSectorDiv.innerHTML = '<br>';
      var subSectorHeading = document.createElement('div');
      subSectorHeading.classList.add('txt-bold');
      subSectorHeading.innerText = 'Sub-Sectors:';
      subSectorDiv.appendChild(subSectorHeading);
      
      // generate subsectors
      subSectorList = sectors[selectedSector]["sub_sectors"];
      for (subSector in subSectorList){
        var sectorButton = document.createElement('button');
        sectorButton.classList.add('btn','btn--stroke','mx3','my3');
        sectorButton.textContent = subSectorList[subSector];
        sectorButton.addEventListener('click', function(){
          toggleSubSector(this)
        })
        subSectorDiv.appendChild(sectorButton);
      };
    }
  };