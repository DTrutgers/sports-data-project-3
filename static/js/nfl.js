
// Create base layers

// Streetmap Layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
});
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });


// Create a baseMaps object
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satelite Map": satellite
};
// Define a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap]
});
// Create a function to add images to the popup icons
function getImage(teamName) {
  if (teamName === "Arizona Cardinals") {
    return "static/images/ArizonaCardinals.gif"
  } else if (teamName === "Atlanta Falcons") {
    return "static/images/AtlantaFalcons.gif"
  } else if (teamName === "Baltimore Ravens") {
    return "static/images/BaltimoreRavens.gif"
  } else if (teamName === "Buffalo Bills") {
    return "static/images/BuffaloBills.gif"
  } else if (teamName === "Carolina Panthers") {
    return "static/images/CarolinaPanthers.gif"
  } else if (teamName === "Cincinnati Bengals") {
    return "static/images/CincinnatiBengals.gif"
  } else if (teamName === "Chicago Bears") {
    return "static/images/ChicagoBears.gif"
  } else if (teamName === "Cleveland Browns") {
    return "static/images/ClevelandBrowns.gif"
  } else if (teamName === "Dallas Cowboys") {
    return "static/images/DallasCowboys.gif"
  } else if (teamName === "Denver Broncos") {
    return "static/images/DenverBroncos.gif"
  } else if (teamName === "Detroit Lions") {
    return "static/images/DetroitLions.gif"
  } else if (teamName === "Green Bay Packers") {
    return "static/images/GreenBayPackers.gif"
  } else if (teamName === "Houston Texans") {
    return "static/images/HoustonTexans.gif"
  } else if (teamName === "Indianapolis Colts") {
    return "static/images/IndianapolisColts.gif"
  } else if (teamName === "Jacksonville Jaguars") {
    return "static/images/JacksonvilleJaguars.gif"
  } else if (teamName === "Kansas City Chiefs") {
    return "static/images/KansasCityChiefs.gif"
  } else if (teamName === "Las Vegas Raiders") {
    return "static/images/LasVegasRaiders.gif"
  } else if (teamName === "Los Angeles Rams / Chargers") {
    return ["static/images/LosAngelesRams.gif", "static/images/LosAngelesChargers.gif"]
  } else if (teamName === "Los Angeles Chargers") {
    return "static/images/LosAngelesChargers.gif"
  } else if (teamName === "Miami Dolphins") {
    return "static/images/MiamiDolphins.gif"
  } else if (teamName === "Minnesota Vikings") {
    return "static/images/MinnesotaVikings.gif"
  } else if (teamName === "New England Patriots") {
    return "static/images/NewEnglandPatriots.gif"
  } else if (teamName === "New Orleans Saints") {
    return "static/images/NewOrleansSaints.gif"
  } else if (teamName === "New York Giants") {
    return "static/images/NewYorkGiants.gif"
  } else if (teamName === "New York Jets / Giants") {
    return ["static/images/NewYorkJets.gif", "static/images/NewYorkGiants.gif"]
  } else if (teamName === "Philadelphia Eagles") {
    return "static/images/PhiladelphiaEagles.gif"
  } else if (teamName === "Pittsburgh Steelers") {
    return "static/images/PittsburghSteelers.gif"
  } else if (teamName === "San Francisco 49ers") {
    return "static/images/SanFrancisco49ers.gif"
  } else if (teamName === "Seattle Seahawks") {
    return "static/images/SeattleSeahawks.gif"
  } else if (teamName === "Tampa Bay Buccaneers") {
    return "static/images/TampaBayBuccaneers.gif"
  } else if (teamName === "Tennessee Titans") {
    return "static/images/TennesseeTitans.gif"
  } else if (teamName === "Washington Football Team") {
    return "static/images/WashingtonFootballTeam.gif"
  }
  else {
    return "static/images/NationalFootballLeague.gif"
  }
};
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps).addTo(myMap);
  
  // Use this link to get the geojson data.
  var link = "./static/data/stadiums.geojson";

  // Grabbing our GeoJSON data..
  d3.json(link, function (data) {
  // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {

    // Call on each feature
      onEachFeature: function (feature, layer) {
        if (feature.properties.Team === "Los Angeles Rams / Chargers" || feature.properties.Team === "New York Jets / Giants") {
          layer.bindPopup("<h2>" + feature.properties.Team + "</h2> <hr> <h3> Stadium: " +
          feature.properties.Stadium + "</h3> <h3> Conference: " + feature.properties.Conference + "</h3>" +
          `<img src=${getImage(feature.properties.Team)[0]} width='100px' />` + `<img src=${getImage(feature.properties.Team)[1]} width='100px' />`);
        }
        else {
          layer.bindPopup("<h2>" + feature.properties.Team + "</h2> <hr> <h3> Stadium: " +
            feature.properties.Stadium + "</h3> <h3> Conference: " + feature.properties.Conference + "</h3>" +
            `<img src=${getImage(feature.properties.Team)} width='100px' />`);
      }
    }
  }).addTo(myMap);
});

