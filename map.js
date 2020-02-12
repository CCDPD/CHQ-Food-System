// standard leaflet map setup
var map = L.map('mapid');
map.setView([42.350, -79.306], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


//geocoded addresses
var geoJSON = L.geoJSON(points).addTo(map);
