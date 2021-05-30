// append team names to HTML dropdown option

d3.json("./static/data/standings.json", function(data){
    console.log(data)

    for (var i =0; i<data.length; i++) {
        var dropdownOption = d3.select("select");
        dropdownOption.append("option")
            .append("option").text(`${data[i].Team} - ${data[i].Name}`)
    };

});

//create event listner

d3.select("select").on("change", updateVisuals)


function updateVisuals() {
    console.log("it worked for now...")
};




// Mike Tyburczy Bubble Graph - Beginning



var w = 1600, h = 500;
    
var radius = 25;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([0, w]);
var forceStrength = 0.05;

var svg = d3.select("#mike-graph").append("svg")
  .attr("width", w)
  .attr("height", h)

var simulation = d3.forceSimulation()
        .force("collide",d3.forceCollide( function(d){
              return d.r + 8 }).iterations(16) 
        )
        .force("charge", d3.forceManyBody())
        .force("y", d3.forceY().y(h / 2))
        .force("x", d3.forceX().x(w / 2))

d3.csv("./static/data/2020_season_stats_con.csv", function(data){
  
  data.forEach(function(d){
    d.r = radius;
    d.x = w / 2;
    d.y = h / 2;
  })
  
  //console.table(data); 
  
  var circles = svg.selectAll("circle")
      .data(data, function(d){ return d.ID;});
  
  var circlesEnter = circles.enter().append("circle")
    .attr("r", function(d, i){ return d.r; })
    .attr("cx", function(d, i){ return 175 + 25 * i + 2 * i ** 2; })
        .attr("cy", function(d, i){ return 250; })
        .attr("r", function(d) { return (d.Wins * 3); })
    .style("fill", function(d){ return "url(#" + d.ID + ")"; })
    .style("pointer-events", "all")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  circles = circles.merge(circlesEnter)

  var defs = svg.append("defs");
        
  defs.selectAll(".team-pattern")
        .data(data, function(d){ return d.ID;})
        .enter()
        .append("pattern")
        .attr("class", "team-pattern")
        .attr("id", function (d) {
            return d.ID
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", function (d) {
        return d.url
    });

  function ticked() {
    //console.log("tick")
    //console.log(data.map(function(d){ return d.x; }));
    circles
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; });
  }   

  simulation
        .nodes(data)
        .on("tick", ticked);
  
  function dragstarted(d,i) {
    //console.log("dragstarted " + i)
    if (!d3.event.active) simulation.alpha(1).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d,i) {
    //console.log("dragged " + i)
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d,i) {
    //console.log("dragended " + i)
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    var me = d3.select(this)
    //console.log(me.classed("selected"))
    me.classed("selected", !me.classed("selected"))
    
    d3.selectAll("circle")
      
    d3.selectAll("circle.selected")
      
  } 

  //Add Tool Tip

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .html(function (d) {
      return (`<br>${d.Name_x_x}: </br> <br>Season Stats:<br> Wins: ${d.Wins} <br> Score: ${d.Score}<br>Points Allowed: ${d.OpponentScore}<br>Time of Possession: ${d.TimeOfPossession}<br>Penalty Yards: ${d.PenaltyYards}<br>Turnover Differential: ${d.TurnoverDifferential}</br>`);
  });
  circles.call(toolTip);

    circles.on("mouseover", function (data) {
    toolTip.show(data, this);
    })

.on("mouseout", function (data, index) {
    toolTip.hide(data);
});

  
  function groupBubbles() {
    hideTitles();

    //Resets x to draw bubbles to the center.
    simulation.force('x', d3.forceX().strength(forceStrength).x(w / 2));

    //Resets the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }
  
  function splitBubbles(byVar) {
    
    centerScale.domain(data.map(function(d){ return d[byVar]; }));
    
    if(byVar == "Season:"){
      hideTitles()
    } else {
        showTitles(byVar, centerScale);
    }
    
    // Resets the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(function(d){ 
        return centerScale(d[byVar]);
    }));

    // Reset the alpha value and restart the simulation
    simulation.alpha(2).restart();
  }
  
  function hideTitles() {
    svg.selectAll('.title').remove();
  }

  function showTitles(byVar, scale) {
   
       var titles = svg.selectAll('.title')
      .data(scale.domain());
    
    titles.enter().append('text')
          .attr('class', 'title')
        .merge(titles)
        .attr('x', function (d) { return scale(d); })
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text(function (d) { return byVar + ' ' + d; });
    
    titles.exit().remove() 
  }
  
  function setupButtons() {
    d3.selectAll('.button')
      .on('click', function () {
          
        // Remove active class from all buttons
        d3.selectAll('.button').classed('active', false);
        // Find button clicked
        var button = d3.select(this);

        // Set as the active button
        button.classed('active', true);

        // Get id of the button
        var buttonId = button.attr('id');

          //console.log(buttonId)
        // Toggle bubble chart based on current button clicked

        splitBubbles(buttonId);
      });
  }
  
  setupButtons()
  
})

// Mike Tyburczy Bubble Graph - End



// Harry Bonsu NFL Team Map - Start

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
    zoom: 4.4999,
    layers: [streetmap, darkmap]
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
  var link = "static/data/stadiums.geojson";

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

// Harry Bonsu NFL Team Map - End


// d3.json("team-schedule.json").then(function(data){
//     console.log(data)
// });


// Bar Graph
// d3.json("2020_season_stats.json").then(function(data){
//     console.log(data)

//     var team = data[1].TeamName;
//     var pointsFor = data[1].Score/16;
//     var pointsAgainst;
//     var touchdowns = data[1].Touchdowns;
//     var totRec;
//     var totRush;
//     var fumbles;

//     console.log(team);
//     console.log(pointsFor);
//     console.log(touchdowns);
      
// });

// // Line Graph

// d3.json("./static/data/NFLscores.json").then(function(data){
//     console.log(data)

//     // Selected Team
//     var teamScore = [];
//     var AwayScoreQuarter1 = [];
//     var AwayScoreQuarter2 = [];
//     var AwayScoreQuarter3 = [];
//     var AwayScoreQuarter4 = [];
//     var HomeScoreQuarter1 = [];
//     var HomeScoreQuarter2 = [];
//     var HomeScoreQuarter3 = [];
//     var HomeScoreQuarter4 = [];

//     //Opponent
//     var oppScore = [];
//     var oppHomeScoreQuarter1 = [];
//     var oppHomeScoreQuarter2 = [];
//     var oppHomeScoreQuarter3 = [];
//     var oppHomeScoreQuarter4 = [];
//     var oppAwayScoreQuarter1 = [];
//     var oppAwayScoreQuarter2 = [];
//     var oppAwayScoreQuarter3 = [];
//     var oppAwayScoreQuarter4 = [];


//     for (var i = 0; i<data.length; i++) {
//         if (data[i].AwayTeam === "HOU") {
//             teamScore.push(data[i].AwayScore);
//             oppScore.push(data[i].HomeScore);
//             AwayScoreQuarter1.push(data[i].AwayScoreQuarter1);
//             AwayScoreQuarter2.push(data[i].AwayScoreQuarter2);
//             AwayScoreQuarter3.push(data[i].AwayScoreQuarter3);
//             AwayScoreQuarter4.push(data[i].AwayScoreQuarter4);
//             oppHomeScoreQuarter1.push(data[i].HomeScoreQuarter1);
//             oppHomeScoreQuarter2.push(data[i].HomeScoreQuarter2);
//             oppHomeScoreQuarter3.push(data[i].HomeScoreQuarter3);
//             oppHomeScoreQuarter4.push(data[i].HomeScoreQuarter4);

//         } else if (data[i].HomeTeam === "HOU") {
//             teamScore.push(data[i].HomeScore);
//             oppScore.push(data[i].AwayScore);
//             HomeScoreQuarter1.push(data[i].HomeScoreQuarter1);
//             HomeScoreQuarter2.push(data[i].HomeScoreQuarter2);
//             HomeScoreQuarter3.push(data[i].HomeScoreQuarter3);
//             HomeScoreQuarter4.push(data[i].HomeScoreQuarter4);
//             oppAwayScoreQuarter1.push(data[i].AwayScoreQuarter1);
//             oppAwayScoreQuarter2.push(data[i].AwayScoreQuarter2);
//             oppAwayScoreQuarter3.push(data[i].AwayScoreQuarter3);
//             oppAwayScoreQuarter4.push(data[i].AwayScoreQuarter4);
//         }
//     }

//     // Selected Team - print
//     console.log(teamScore);
//     console.log(AwayScoreQuarter1);
//     console.log(AwayScoreQuarter2);
//     console.log(AwayScoreQuarter3);
//     console.log(AwayScoreQuarter4);
//     console.log(HomeScoreQuarter1);
//     console.log(HomeScoreQuarter2);
//     console.log(HomeScoreQuarter3);
//     console.log(HomeScoreQuarter4);
    

//     // Opponent - print
//     console.log(oppScore);
//     console.log(oppHomeScoreQuarter1);
//     console.log(oppHomeScoreQuarter2);
//     console.log(oppHomeScoreQuarter3);
//     console.log(oppHomeScoreQuarter4);
//     console.log(oppAwayScoreQuarter1);
//     console.log(oppAwayScoreQuarter2);
//     console.log(oppAwayScoreQuarter3);
//     console.log(oppAwayScoreQuarter4);



// });


// // This was for NFLscores.json
// for (var i = 0; i<data.length; i++) {
//     if (data[i].AwayTeam === "HOU") {
//         weeks.push(data[i].Week);
//         teamScore.push(data[i].AwayScore);
//     } else if (data[i].HomeTeam === "HOU") {
//         weeks.push(data[i].Week);
//         teamScore.push(data[i].HomeScore);
//     }
// }

// d3.json("static/data/Stadiums.json").then(function(data){
//     console.log(data)
// });

