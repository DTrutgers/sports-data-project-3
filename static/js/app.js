// // Bar Graph
// d3.json("./static/data/2020_season_stats.json", function(data){
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

// append team names to HTML dropdown option

d3.json("./static/data/standings.json", function(data){
    // console.log(data)

    for (var i =0; i<data.length; i++) {
        var dropdownOption = d3.select("select");
        dropdownOption.append("option")
            .text(`${data[i].Team} - ${data[i].Name}`)
            .attr("value", `${data[i].Team}`)
    };

});

//create event listner

d3.select("select").on("change",createBar)


function getTeamColor(team) {

  if (team === "NE" || team === "HOU" || team === "DAL" || team === "LAR") {
    return "navy"
  } else if (team === "NYG" || team === "BUF" || team === "IND") {
    return "blue"
  } else if (team === "MIA" || team === "JAX") {
    return "aqua"
  } else if (team === "TEN" || team === "LAC" || team === "CAR" || team === "DET") {
    return "lightblue"
  } else if (team === "DEN" || team === "CHI" || team === "CIN" || team === "CLE") {
    return "orange"
  } else if (team === "GB" || team === "PHI" || team === "NYJ") {
    return "green"
  } else if (team === "NO" || team === "PIT") {
    return "goldenrod"
  } else if (team === "MIN" || team === "BAL") {
    return "purple"
  } else if (team === "SF" || team === "WAS" || team === "TB") {
    return "brown"
  } else if (team === "ATL" || team === "ARI" || team === "KC") {
    return "red"
  } else if (team === "LV") {
    return "black"
  } else if (team === "SEA") {
    return "lime"
  };
};





// Diverging Bar graph for team statistics
function createBar(team) {

  // clear svg area for updated bar graph from event listener
  d3.select("#david-graph").select("svg").remove();


  // define svg area
  var svgHeight = 500;
  var svgWidth = 800;

  var margin = {
      top: 50,
      right: 10,
      bottom: 30,
      left: 50
  };

  var height = svgHeight-margin.top-margin.bottom;
  var width = svgWidth-margin.right-margin.left;

  // create svg area for bar graph
  var svg = d3.select("#david-graph")
      .append("svg")
      // .append("div")
      // .classed("svg-container", true)
      // .append("svg")
      // .attr("preserveAspectRatio", "xMinYMin meet")
      // .classed("svg-content-responsive", true)
      .attr("width", svgWidth)
      .attr("height", svgHeight);

  

  var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);



  // get data and convert into statistics for bar graph
  d3.json("./static/data/2020_season_stats.json", function(data) {
      // console.log(data);

      var team = d3.select("select").property("value");

      var teamStats = {};
      var leagueStats = {};

      for (var i = 0; i<data.length; i++) {
          if (data[i].Team === team) {
              // teamStats["team"] = data[i].TeamName;
              teamStats["pointsFor"] = data[i].Score/16;
              teamStats["pointsAgainst"] = data[i].OpponentScore/16;
              teamStats["touchdowns"] = data[i].Touchdowns;
              teamStats["recYardsPerGame"] = data[i].PassingYards/16;
              teamStats["rushYardsPerGame"] = data[i].RushingYards/16;
              teamStats["fumbles"] = data[i].Fumbles;
              teamStats["completions"] = data[i].CompletionPercentage;
              teamStats["firtsDowns"] = data[i].FirstDowns;
              teamStats["turnovers"] = data[i].Giveaways;
              teamStats["passingYards"] =data[i].PassingYards;
              teamStats["penalties"] = data[i].Penalties;
              teamStats["sacks"] = data[i].Sacks;
          }       
      };

      // arrays to hold each team stats to calculate the total for the league
      var leaguePoints = [];
      var leaguePointsAgainst = [];
      var leaguetouchdowns = [];
      var leaguerecYardsPerGame = [];
      var leaguerushYardsPerGame = [];
      var leaguefumbles = [];
      var leaguecompletions = [];
      var leaguefirtsDowns = [];
      var leagueturnovers = [];
      var leaguepassingYards = [];
      var leaguepenalties = [];
      var leaguesacks = [];

      // loop through each team to get data and push to empty arrays above
      data.forEach(function(d) {
          leaguePoints.push(d.Score/16);
          leaguePointsAgainst.push(d.OpponentScore/16);
          leaguetouchdowns.push(d.Touchdowns);
          leaguerecYardsPerGame.push(d.PassingYards/16);
          leaguerushYardsPerGame.push(d.RushingYards/16);
          leaguefumbles.push(d.Fumbles);
          leaguecompletions.push(d.CompletionPercentage);
          leaguefirtsDowns.push(d.FirstDowns);
          leagueturnovers.push(d.Giveaways);
          leaguepassingYards.push(d.PassingYards);
          leaguepenalties.push(d.Penalties);
          leaguesacks.push(d.Sacks);
      });

      // define variables for totals
      var totalPoints = 0;
      var totalOpp = 0;
      var totalTouchdowns = 0;
      var totalrec = 0;
      var totalrush = 0;
      var totalfumbles = 0;
      var totalcompletion = 0;
      var totalfirstdown = 0;
      var totalturnover = 0;
      var totalpassing = 0;
      var totalpenalties = 0;
      var totalsacks = 0;

      // loop through each array from above and get totals
      for (var k = 0; k<leaguePoints.length; k++) {
          // console.log(leaguePoints[k])
          totalPoints += leaguePoints[k];
          totalOpp += leaguePointsAgainst[k];
          totalTouchdowns += leaguetouchdowns[k];
          totalrec += leaguerecYardsPerGame[k];
          totalrush += leaguerushYardsPerGame[k];
          totalfumbles += leaguefumbles[k];
          totalcompletion += leaguecompletions[k];
          totalfirstdown += leaguefirtsDowns[k];
          totalturnover += leagueturnovers[k];
          totalpassing += leaguepassingYards[k];
          totalpenalties += leaguepenalties[k];
          totalsacks += leaguesacks[k];
              
      };
      
      // append league averages to leagueStats Object for visualization below
      leagueStats["pointsFor"] = totalPoints/32;
      leagueStats["pointsAgainst"] = totalOpp/32;
      leagueStats["touchdowns"] = totalTouchdowns/32;
      leagueStats["recYardsPerGame"] = totalrec/32;
      leagueStats["rushYardsPerGame"] = totalrush/32;
      leagueStats["fumbles"] = totalfumbles/32;
      leagueStats["completions"] = totalcompletion/32;
      leagueStats["firtsDowns"] = totalfirstdown/32;
      leagueStats["turnovers"] = totalturnover/32;
      leagueStats["passingYards"] = totalpassing/32;
      leagueStats["penalties"] = totalpenalties/32;
      leagueStats["sacks"] = totalsacks/32;

          
    console.log(teamStats);
    console.log(Object.values(teamStats));
    
    console.log(leagueStats);    
    console.log(Object.values(leagueStats));

      // define xscales for axis
      var xScale = d3.scaleLinear()
          .domain([0, 100])
          .range([width/2,0]);
          
      var xScale2 = d3.scaleLinear()
          .domain([0, 100])
          .range([0, width/2]);

      var middleScale = d3.scaleLinear()
          .domain(Object.keys(teamStats))
          .range([0, width/2]);

      var bottomAxis = d3.axisBottom(xScale);
      var middleAxis = d3.axisRight(middleScale);
      var bottomRight = d3.axisBottom(xScale2);

      chartGroup.append("g")
          .attr("transform", `translate(0, ${height-5})`)
          .call(bottomAxis);

        chartGroup.append("g")
          .attr("transform", `translate(${width/2}, ${height-5})`)
          .call(bottomRight);      

      chartGroup.append("g")
          .attr("transform", `translate(${width/2},0)`)
          .call(middleAxis);

      // create individual bars based on data from teamStats and leagueStats
      //Team Stat Bars - Left side
      var touchdowns = chartGroup.selectAll(".bar1")
          .data(Object.values(teamStats))
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("y", 0)
          .attr("x", (width/2)-(Object.values(teamStats)[2]*(400))/100)       
          .attr("width", (Object.values(teamStats)[2]*(400))/100)
          .attr("height", 30)
          .style("opacity", .2)
          .style("fill",getTeamColor(team));

    var passing = chartGroup.selectAll(".bar2")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 35)
        .attr("x", (width/2)-(Object.values(teamStats)[9]*400)/10000)   
        .attr("width", (Object.values(teamStats)[9]*400)/10000)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var completions = chartGroup.selectAll(".bar3")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 70)
        .attr("x", (width/2)-(Object.values(teamStats)[6]*400)/100)       
        .attr("width", (Object.values(teamStats)[6]*400)/100)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var rushing = chartGroup.selectAll(".bar4")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 105)
        .attr("x", (width/2)-(Object.values(teamStats)[4]*400/150))       
        .attr("width", Object.values(teamStats)[4]*400/150)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var receiving = chartGroup.selectAll(".bar5")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 140)
        .attr("x", (width/2)-(Object.values(teamStats)[3]*400/500))       
        .attr("width", Object.values(teamStats)[3]*400/500)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var forPoints = chartGroup.selectAll(".bar6")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 175)
        .attr("x", (width/2)-(Object.values(teamStats)[0]*400/40))       
        .attr("width", Object.values(teamStats)[0]*400/40)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var downs = chartGroup.selectAll(".bar7")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 210)
        .attr("x", (width/2)-(Object.values(teamStats)[7]*400/600))       
        .attr("width", Object.values(teamStats)[7]*400/600)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var fumble = chartGroup.selectAll(".bar8")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 245)
        .attr("x", (width/2)-(Object.values(teamStats)[5]*400/50))       
        .attr("width", Object.values(teamStats)[5]*400/50)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var turnovers = chartGroup.selectAll(".bar9")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 280)
        .attr("x", (width/2)-(Object.values(teamStats)[8]*400/50))       
        .attr("width", Object.values(teamStats)[8]*400/50)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var penalty = chartGroup.selectAll(".bar10")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 315)
        .attr("x", (width/2)-(Object.values(teamStats)[10]*400/150))       
        .attr("width", Object.values(teamStats)[10]*400/150)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var sack = chartGroup.selectAll(".bar11")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 350)
        .attr("x", (width/2)-(Object.values(teamStats)[11]*400/50))      
        .attr("width", Object.values(teamStats)[11]*400/50)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));

    var oppPoints = chartGroup.selectAll(".bar12")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 385)
        .attr("x", (width/2)-(Object.values(teamStats)[1]*400/40))       
        .attr("width", Object.values(teamStats)[1]*400/40)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill",getTeamColor(team));
    
    // Left Bar End


    // League Stat Bars - Right side
    var NFLtouchdowns = chartGroup.selectAll(".bar13")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 0)
        .attr("x", width/2 + 5)       
        .attr("width", (Object.values(leagueStats)[2]*(400))/100)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLpassing = chartGroup.selectAll(".bar14")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 35)
        .attr("x", width/2 + 5)     
        .attr("width", (Object.values(leagueStats)[9]*400)/10000)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLcompletions = chartGroup.selectAll(".bar15")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 70)
        .attr("x", width/2 + 5)       
        .attr("width", (Object.values(leagueStats)[6]*400)/100)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLrushing = chartGroup.selectAll(".bar16")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 105)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[4]*400/150)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLreceiving = chartGroup.selectAll(".bar17")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 140)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[3]*400/500)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLforPoints = chartGroup.selectAll(".bar18")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 175)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[0]*400/40)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLdowns = chartGroup.selectAll(".bar19")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 210)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[7]*400/600)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLfumble = chartGroup.selectAll(".bar20")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 245)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[5]*400/50)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLturnovers = chartGroup.selectAll(".bar21")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 280)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[8]*400/50)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLpenalty = chartGroup.selectAll(".bar22")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 315)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[10]*400/150)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLsack = chartGroup.selectAll(".bar23")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 350)
        .attr("x", width/2 + 5)      
        .attr("width", Object.values(leagueStats)[11]*400/50)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

    var NFLoppPoints = chartGroup.selectAll(".bar24")
        .data(Object.values(leagueStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 385)
        .attr("x", width/2 + 5)       
        .attr("width", Object.values(leagueStats)[1]*400/40)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","grey");

      // Right Bar End
  });

};

// End Diverging Bar Graph




// Mike Tyburczy Bubble Graph - Beginning

var w = 1500, h = 500;
    
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
  
  // do not comment this - Graph needs this to run
  // console.table(data); 
  
  var circles = svg.selectAll("circle")
      .data(data, function(d){ return d.ID;});
  
  var circlesEnter = circles.enter().append("circle")
    .attr("r", function(d, i){ return d.r; })
    .attr("cx", function(d, i){ return 175 + 25 * i + 2 * i ** 2; })
        .attr("cy", function(d, i){ return 250; })
        .attr("r", function(d) { return (d.Wins * 2+10); })
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
    // console.log("tick")
    // console.log(data.map(function(d){ return d.x; }));
    circles
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; });
  }   

  simulation
        .nodes(data)
        .on("tick", ticked);
  
  function dragstarted(d,i) {
    // console.log("dragstarted " + i)
    if (!d3.event.active) simulation.alpha(1).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d,i) {
    // console.log("dragged " + i)
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d,i) {
    // console.log("dragended " + i)
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    var me = d3.select(this)
    console.log(me.classed("selected"))
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

  circles.on("click", function (data) {
      toolTip.show(data, this);
      })
      svg.on("mouseover", function (data) {
        toolTip.hide(data, this);
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


// Tejas Patel - Bar Race Chart
d3.json("./static/data/NFLscores.json", function(data){

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    am4core.globalAdapter.addAll(2)
    var chart = am4core.create("tejas-graph", am4charts.XYChart);
    chart.padding(40, 40, 40, 40);
    chart.numberFormatter.numberFormat = "#,###.";
    var label = chart.plotContainer.createChild(am4core.Label);
    label.x = am4core.percent(97);
    label.y = am4core.percent(95);
    label.horizontalCenter = "right";
    label.verticalCenter = "middle";
    label.dx = -15;
    label.fontSize = 50;
    
    var playButton = chart.plotContainer.createChild(am4core.PlayButton);
    playButton.x = am4core.percent(97);
    playButton.y = am4core.percent(95);
    playButton.dy = -2;
    playButton.verticalCenter = "middle";
    playButton.events.on("toggled", function (event) {
      if (event.target.isActive) {
        play();
      }
      else {
        stop();
      }
    })
    
    var stepDuration = 900;
    
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "team";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = false;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.max = 16;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = stepDuration*100;
    valueAxis.extraMax = 1;
    
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "team";
    series.dataFields.valueX = "win";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.maxColumns = 1
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.interpolationDuration = stepDuration;
    series.interpolationEasing = am4core.ease.linear;
    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = -10;
    labelBullet.label.maxColumns = 1;
    chart.zoomOutButton.disabled = true;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    
    var week = 1;
    label.text = week.toString();
    
    var interval;
    
    function play() {
      interval = setInterval(function () {
        nextweek();
      }, stepDuration)
      nextweek();
    }
    
    function stop() {
      if (interval) {
        clearInterval(interval);
      }
    }
    
    function nextweek() {
      week++
    
      if (week > 17) {
        week = 1;
      }
    
      var newData = allData[week];
      var itemsWithNonZero = 0;
      for (var i = 0; i < chart.data.length; i++) {
        chart.data[i].win = newData[i].win;
        if (chart.data[i].win > 0) {
          itemsWithNonZero++;
    
        }
      }
    
      if (itemsWithNonZero > 25) {
        itemsWithNonZero = 25
      }
    
      if (week == 1) {
        series.interpolationDuration = stepDuration / 4;
        valueAxis.rangeChangeDuration = stepDuration / 4;
      }
      else {
        series.interpolationDuration = stepDuration;
        valueAxis.rangeChangeDuration = stepDuration;
      }
    
      chart.invalidateRawData();
      label.text = week.toString();
    
      categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
    }
    
    
    categoryAxis.sortBySeries = series;
    
    // d3.json("data/NFLscores.json", function (data) {
      // console.log(data)
      var allData = {
        "1": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },
        ],
        "2": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "3": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "4": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "5": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "6": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "7": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "8": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "9": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "10": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "11": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "12": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "13": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "14": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "15": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "16": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
        "17": [{ "team": "BUF", win: 0 },
        { "team": "MIA", win: 0 },
        { "team": "NE", win: 0 },
        { "team": "NYJ", win: 0 },
        { "team": "PIT", win: 0 },
        { "team": "BAL", win: 0 },
        { "team": "CLE", win: 0 },
        { "team": "CIN", win: 0 },
        { "team": "IND", win: 0 },
        { "team": "TEN", win: 0 },
        { "team": "HOU", win: 0 },
        { "team": "JAX", win: 0 },
        { "team": "KC", win: 0 },
        { "team": "LV", win: 0 },
        { "team": "LAC", win: 0 },
        { "team": "DEN", win: 0 },
        { "team": "WAS", win: 0 },
        { "team": "NYG", win: 0 },
        { "team": "DAL", win: 0 },
        { "team": "PHI", win: 0 },
        { "team": "GB", win: 0 },
        { "team": "CHI", win: 0 },
        { "team": "MIN", win: 0 },
        { "team": "DET", win: 0 },
        { "team": "NO", win: 0 },
        { "team": "TB", win: 0 },
        { "team": "CAR", win: 0 },
        { "team": "ATL", win: 0 },
        { "team": "SEA", win: 0 },
        { "team": "LAR", win: 0 },
        { "team": "ARI", win: 0 },
        { "team": "SF", win: 0 },],
      };
    
    
  // use for loop to loop through week 1 - 17 
  for (var j = 1; j < 18; j++) {
    // use the variable j to loop through allData 
    allData[j].forEach((d) => {
      // loop through data from NFLscores.json
      for (var i = 0; i < data.length; i++) {
        // If team from allData object matches team from NFLscores.json add win to allData
        if (data[i].AwayTeam == d.team && data[i].Week === j) {
          // console.log(data[i])
          // if allData team is the away team
          if (data[i].AwayScore > data[i].HomeScore) {
            d.win += 1
          }
        } else if (data[i].HomeTeam == d.team && data[i].Week === j) {
          // console.log(data[i]);
          // if allData team is the home team
          if (data[i].HomeScore > data[i].AwayScore) {
            d.win += 1
          }
        }
      };

    });

    // this for loop section will iterate through allData object and add wins for each team by week
    for (var k = 0; k < 32; k++) {
      try {
        if (allData[j][k].team == allData[j - 1][k].team)
          allData[j][k].win += allData[j - 1][k].win;

      } catch (err) {
        allData[j][k].win = allData[j][k].win;
      }
    }

  };

  // console.log(allData);

  chart.data = JSON.parse(JSON.stringify(allData[week]));
  categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

  series.events.on("inited", function () {
    setTimeout(function () {
      playButton.isActive = true; // this starts interval
    }, 2000)
  })
    
});
