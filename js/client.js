//initialize the map to gambier, this will show prior to the user sharing location data
var map = L.map('mapid').setView([40.375, -82.395], 15);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 24,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZG93bmV5biIsImEiOiJjazY2enB4cnYxcjU5M2VyMGUwemwxOW1sIn0.sAZum05jyxPiL0DtncaBhw'
}).addTo(map);

var currentLocation={};

//center the map on the user
//Needs tested on mobile, rn it isn't very accurate on desktop :(
var mymap = map.locate({setView: true, maxZoom: 24, watch: true, enableHighAccuracy: true});

var userMarker={};
function onLocationFound(e) {

    $('#location').val(e.latlng);
    currentLocation=e.latlng;

    if(userMarker != undefined){
        map.removeLayer(userMarker); //clear previous marker
    }
        
    mymap = map.locate({setView: true, maxZoom: 24, watch: true, enableHighAccuracy: true}); //find user location, center map on them   
    userMarker = L.circle(e.latlng, {radius: '10', opacity: '1.0', color: 'blue', fillColor: 'blue', fillOpacity: '1.0'}).addTo(map);// add a marker to the user's current location
}
    

map.on('locationfound', onLocationFound);

// var socket = io();

var pinGroup = L.layerGroup().addTo(map);
// var pin = L.marker([40.375, -82.395]).addTo(pinGroup);

$('#add-button').click(function(){
    $('#add-menu').show();
    $("#map_container").toggleClass("col-6");
    $('#add-button').hide();
    $('#location').val(currentLocation);
})

$('#x').click(function(){
    $('add-menu').hide();
    $("#map_container").toggleClass("col-6");
    $('#add-button').show();
})
$('#submitLocation').click(function(){
    $('add-menu').hide();
    $("#map_container").toggleClass("col-6");
    $('#add-button').show();
    var pin = L.marker(currentLocation).addTo(pinGroup);
})

$(document).ready(function(){
    jQuery.get('/getLocations', function(data, status){
        for (var i =0; i < data.length; i++) {
             console.log(data[i].location);
             location_string=data[i].location;
             var location_substr = location_string.substring(7,location_string.length-1);
             var coordinates=location_substr.split(',');
             coordinates[1]=coordinates[1].substring(1,coordinates[1].length)
             console.log(coordinates);
             var pin = L.marker(coordinates).addTo(pinGroup);
        }
    })
})