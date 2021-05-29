


 function createMap(earthquake) {

 
  
  
  var lightmap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });

   // Create a baseMaps object to hold the lightmap layer
   var baseMaps = {
     "Light Map": lightmap
   };

   // Create an overlayMaps object to hold the earthquake layer
   var overlayMaps = {
     "quake": earthquake
   };

   var myMap = L.map("mapid", {
     center: [15.5994, -28.6731],
     zoom: 12,
     layers: [lightmap, earthquake]
   });

     // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
     L.control.layers(baseMaps, overlayMaps, {
       collapsed: false
     }).addTo(myMap);
  
  

 };

 function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var stations = response.features[0];
  console.log(`stations api call features count: ${station}`);

  // Initialize an array to hold bike markers
  var earthquakeMarkers = [];

  // Loop through the earthquakes array
  for (var index = 0; index < stations.length; index++) {
    var station = stations[index];
    console.log(`station api call: ${station[index]}`);
    // For each station, create a marker and bind a popup with the station's name
    var earthquakeMarkers = L.marker([station.lat, station.lon])
      .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");

    // Add the marker to the bikeMarkers array
    earthquakeMarkers.push(earthquakeMarkers);
  };

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(earthquakeMarkers));
};



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
