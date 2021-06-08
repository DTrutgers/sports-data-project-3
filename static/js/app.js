// call initial bar graph
createBar("BUF");

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

// This function will send team color to bar graph below
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
  d3.select("#garrett-graph").select("div").remove();

  var team = team;

  // define svg area
  var svgHeight = 500;
  var svgWidth = 800;

  var margin = {
    top: 50,
    right: 50,
    bottom: 30,
    left: 180
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.right - margin.left;

  // create svg area for bar graph
  var svg = d3.select("#garrett-graph")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", "0 0 800 500")
    .classed("svg-content", true)
    // .attr("width", svgWidth)
    // .attr("height", svgHeight);


  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

  chartGroup.append("text")
    .attr("x", (width / 2) + (width/4))             
    .attr("y", 30-margin.top)
    .classed("title-text", true)
    .attr("text-anchor", "middle")  
    .style("font-size", "22px")   
    .text("League Average");


  // get data and convert into statistics for bar graph
  d3.json("./static/data/2020_season_stats.json", function (data) {
    // console.log(data);

    var team = d3.select("select").property("value");

    var teamStats = {};
    var leagueStats = {};

    var teamName = [];

    for (var i = 0; i < data.length; i++) {
      if (team === "") {
        if (data[i].Team === "BUF") {
          teamName.push(data[i].TeamName);
          teamStats["pointsFor"] = data[i].Score / 16;
          teamStats["pointsAgainst"] = data[i].OpponentScore / 16;
          teamStats["touchdowns"] = data[i].Touchdowns;
          teamStats["recYardsPerGame"] = data[i].PassingYards / 16;
          teamStats["rushYardsPerGame"] = data[i].RushingYards / 16;
          teamStats["fumbles"] = data[i].Fumbles;
          teamStats["completions"] = data[i].CompletionPercentage;
          teamStats["firtsDowns"] = data[i].FirstDowns;
          teamStats["turnovers"] = data[i].Giveaways;
          teamStats["passingYards"] = data[i].PassingYards;
          teamStats["penalties"] = data[i].Penalties;
          teamStats["sacks"] = data[i].Sacks;
        }
      } else {
        if (data[i].Team === team) {
          teamName.push(data[i].TeamName);
          teamStats["pointsFor"] = data[i].Score / 16;
          teamStats["pointsAgainst"] = data[i].OpponentScore / 16;
          teamStats["touchdowns"] = data[i].Touchdowns;
          teamStats["recYardsPerGame"] = data[i].PassingYards / 16;
          teamStats["rushYardsPerGame"] = data[i].RushingYards / 16;
          teamStats["fumbles"] = data[i].Fumbles;
          teamStats["completions"] = data[i].CompletionPercentage;
          teamStats["firtsDowns"] = data[i].FirstDowns;
          teamStats["turnovers"] = data[i].Giveaways;
          teamStats["passingYards"] = data[i].PassingYards;
          teamStats["penalties"] = data[i].Penalties;
          teamStats["sacks"] = data[i].Sacks;
        };
      };
    };

    // console.log(teamName)

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
    data.forEach(function (d) {
      leaguePoints.push(d.Score / 16);
      leaguePointsAgainst.push(d.OpponentScore / 16);
      leaguetouchdowns.push(d.Touchdowns);
      leaguerecYardsPerGame.push(d.PassingYards / 16);
      leaguerushYardsPerGame.push(d.RushingYards / 16);
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
    for (var k = 0; k < leaguePoints.length; k++) {
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
    leagueStats["pointsFor"] = totalPoints / 32;
    leagueStats["pointsAgainst"] = totalOpp / 32;
    leagueStats["touchdowns"] = totalTouchdowns / 32;
    leagueStats["recYardsPerGame"] = totalrec / 32;
    leagueStats["rushYardsPerGame"] = totalrush / 32;
    leagueStats["fumbles"] = totalfumbles / 32;
    leagueStats["completions"] = totalcompletion / 32;
    leagueStats["firtsDowns"] = totalfirstdown / 32;
    leagueStats["turnovers"] = totalturnover / 32;
    leagueStats["passingYards"] = totalpassing / 32;
    leagueStats["penalties"] = totalpenalties / 32;
    leagueStats["sacks"] = totalsacks / 32;


    // console.log(teamStats);
    // console.log(Object.values(teamStats));

    // console.log(leagueStats);
    // console.log(Object.values(leagueStats));

  chartGroup.append("text")
    .attr("x", (width / 4))             
    .attr("y", 30-margin.top)
    .classed("title-text", true)
    .attr("text-anchor", "middle")  
    .style("font-size", "22px")    
    .text(teamName[0]);

    // define xscales for axis
    var xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([width / 2, 0]);

    var xScale2 = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width / 2]);

    var middleScale = d3.scaleLinear()
      .domain(Object.keys(teamStats))
      .range([0, height]);


    var middleAxis = d3.axisRight(middleScale)    
    var bottomAxis = d3.axisBottom(xScale);
    var bottomRight = d3.axisBottom(xScale2);

    // chartGroup.append("g")
    //   .attr("transform", `translate(0, ${height - 5})`)
    //   .call(bottomAxis);

    // chartGroup.append("g")
    //   .attr("transform", `translate(${width / 2}, ${height - 5})`)
    //   .call(bottomRight);

    chartGroup.append("g")
      .attr("transform", `translate(${(width/2)+1.75},-2)`)
      .attr("class", "middle-axis")
      .call(middleAxis);

    

    // create individual bars based on data from teamStats and leagueStats
    
    ///////////////////////////////////
    // League Stat Bars - Left side //
    //////////////////////////////////

    var touchdowns = chartGroup.selectAll(".bar1")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 0)
      .attr("x", (width / 2) - (Object.values(teamStats)[2] * (400)) / 100)
      .attr("width", (Object.values(teamStats)[2] * (400)) / 100)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 22.5)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[2]}`);

    var passing = chartGroup.selectAll(".bar2")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 35)
      .attr("x", (width / 2) - (Object.values(teamStats)[9] * 400) / 10000)
      .attr("width", (Object.values(teamStats)[9] * 400) / 10000)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 55)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[9]}`);

    var completions = chartGroup.selectAll(".bar3")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 70)
      .attr("x", (width / 2) - (Object.values(teamStats)[6] * 400) / 100)
      .attr("width", (Object.values(teamStats)[6] * 400) / 100)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 90)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[6]}`);

    var rushing = chartGroup.selectAll(".bar4")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 105)
      .attr("x", (width / 2) - (Object.values(teamStats)[4] * 400 / 220))
      .attr("width", Object.values(teamStats)[4] * 400 / 220)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 125)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[4].toFixed(1)}`);

    var receiving = chartGroup.selectAll(".bar5")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 140)
      .attr("x", (width / 2) - (Object.values(teamStats)[3] * 400 / 500))
      .attr("width", Object.values(teamStats)[3] * 400 / 500)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 160)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[3].toFixed(1)}`);

    var forPoints = chartGroup.selectAll(".bar6")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 175)
      .attr("x", (width / 2) - (Object.values(teamStats)[0] * 400 / 40))
      .attr("width", Object.values(teamStats)[0] * 400 / 40)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 195)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[0].toFixed(1)}`);

    var downs = chartGroup.selectAll(".bar7")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 210)
      .attr("x", (width / 2) - (Object.values(teamStats)[7] * 400 / 600))
      .attr("width", Object.values(teamStats)[7] * 400 / 600)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 232.5)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[7]}`);

    var fumble = chartGroup.selectAll(".bar8")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 245)
      .attr("x", (width / 2) - (Object.values(teamStats)[5] * 400 / 50))
      .attr("width", Object.values(teamStats)[5] * 400 / 50)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 265)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[5]}`);

    var turnovers = chartGroup.selectAll(".bar9")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 280)
      .attr("x", (width / 2) - (Object.values(teamStats)[8] * 400 / 50))
      .attr("width", Object.values(teamStats)[8] * 400 / 50)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 300)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[8]}`);

    var penalty = chartGroup.selectAll(".bar10")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 315)
      .attr("x", (width / 2) - (Object.values(teamStats)[10] * 400 / 150))
      .attr("width", Object.values(teamStats)[10] * 400 / 150)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 335)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[10]}`);

    var sack = chartGroup.selectAll(".bar11")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 350)
      .attr("x", (width / 2) - (Object.values(teamStats)[11] * 400 / 100))
      .attr("width", Object.values(teamStats)[11] * 400 / 100)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 370)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[11]}`);

    var oppPoints = chartGroup.selectAll(".bar12")
      .data(Object.values(teamStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 385)
      .attr("x", (width / 2) - (Object.values(teamStats)[1] * 400 / 40))
      .attr("width", Object.values(teamStats)[1] * 400 / 40)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", getTeamColor(team));

    chartGroup.append("text")
      .attr("x", width/2-30)             
      .attr("y", 405)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(teamStats)[1].toFixed(1)}`);

    ///////////////////////////////////////
    // League Stat Bars - Left side End //
    /////////////////////////////////////

    ///////////////////////////////////
    // League Stat Bars - Right side //
    //////////////////////////////////
    var NFLtouchdowns = chartGroup.selectAll(".bar13")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 0)
      .attr("x", width / 2 + 5)
      .attr("width", (Object.values(leagueStats)[2] * (400)) / 100)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 22.5)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[2].toFixed(1)}`);

    var NFLpassing = chartGroup.selectAll(".bar14")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 35)
      .attr("x", width / 2 + 5)
      .attr("width", (Object.values(leagueStats)[9] * 400) / 10000)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
    .attr("x", (width/2)+40)             
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[9].toFixed(1)}`);

    var NFLcompletions = chartGroup.selectAll(".bar15")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 70)
      .attr("x", width / 2 + 5)
      .attr("width", (Object.values(leagueStats)[6] * 400) / 100)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 90)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[6].toFixed(1)}`);

    var NFLrushing = chartGroup.selectAll(".bar16")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 105)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[4] * 400 / 180)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+35)             
      .attr("y", 125)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[4].toFixed(1)}`);

    var NFLreceiving = chartGroup.selectAll(".bar17")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 140)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[3] * 400 / 500)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+35)             
      .attr("y", 160)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[3].toFixed(1)}`);

    var NFLforPoints = chartGroup.selectAll(".bar18")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 175)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[0] * 400 / 40)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 195)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[0].toFixed(1)}`);

    var NFLdowns = chartGroup.selectAll(".bar19")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 210)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[7] * 400 / 600)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+35)             
      .attr("y", 232.5)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[7].toFixed(1)}`);

    var NFLfumble = chartGroup.selectAll(".bar20")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 245)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[5] * 400 / 50)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 265)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[5].toFixed(1)}`);

    var NFLturnovers = chartGroup.selectAll(".bar21")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 280)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[8] * 400 / 50)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 300)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[8].toFixed(1)}`);

    var NFLpenalty = chartGroup.selectAll(".bar22")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 315)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[10] * 400 / 150)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 335)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[10].toFixed(1)}`);

    var NFLsack = chartGroup.selectAll(".bar23")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 350)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[11] * 400 / 100)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 370)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[11].toFixed(1)}`);

    var NFLoppPoints = chartGroup.selectAll(".bar24")
      .data(Object.values(leagueStats))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", 385)
      .attr("x", width / 2 + 5)
      .attr("width", Object.values(leagueStats)[1] * 400 / 40)
      .attr("height", 30)
      .style("opacity", .2)
      .style("fill", "grey");

    chartGroup.append("text")
      .attr("x", (width/2)+30)             
      .attr("y", 405)
      .classed("title-text", true)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")    
      .text(`${Object.values(leagueStats)[1].toFixed(1)}`);

    ////////////////////////////////////////
    // League Stat Bars - Right side End //
    //////////////////////////////////////

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 22.5)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Touchdowns`);
    
    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 55)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Passing Yards`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 90)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Completion %`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 125)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Rush per Game`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 160)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Receiving per Game`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 195)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Points per Game`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 232.5)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Firstdowns`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 265)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Fumbles`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 300)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Turnovers`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 335)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Penalties`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 370)
      .classed("title-text", true)
      .attr("text-anchor", "right")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Sacks`);

    chartGroup.append("text")
      .attr("x", -margin.left + 10)             
      .attr("y", 405)
      .classed("title-text", true)
      .attr("text-anchor", "left")
      // .style("fill", "white")
      .style("font-size", "18px")    
      .text(`Pts Allowed`);

  });

};

// End Diverging Bar Graph




// Mike Tyburczy Bubble Graph - Beginning

var w = 1200, h = 500;
    
var radius = 25;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var centerScale = d3.scalePoint().padding(1).range([0, w]);
var forceStrength = 0.05;

var svg = d3.select("#mike-graph").append("svg")
  .attr("width", w)
  .attr("height", h);

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
        .text(function (d) { return d; });
    
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
    valueAxis.max = 15;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = stepDuration*100;
    // valueAxis.extraMax = 1;

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
    var columnTemplate = series.columns.template;
    columnTemplate.height = am4core.percent(50);
    columnTemplate.maxHeight = 50;
    columnTemplate.column.cornerRadius(60, 10, 60, 10);
    columnTemplate.strokeOpacity = 0;
    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = -10;
    labelBullet.label.maxColumns = 1;
    chart.zoomOutButton.disabled = true;
    var bullet = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = .5;
    bullet.valign = "middle";
    bullet.align = "right";
    bullet.isMeasured = true;
    bullet.interactionsEnabled = false;
    bullet.horizontalCenter = "right";
    bullet.interactionsEnabled = false;
    var outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add("radius", function (radius, target) {
    var circleBullet = target.parent;
    return circleBullet.circle.pixelRadius;
})

    var image = labelBullet.createChild(am4core.Image);
    image.width = 15;
    image.height = 15;
    image.horizontalCenter = "left";
    image.verticalCenter = "middle";
    image.propertyFields.href = "image";

    image.adapter.add("mask", function (mask, target) {
    var circleBullet = target.parent;
    return circleBullet.circle;

    });
    
    // var series = chart.series.push(new am4charts.ColumnSeries());
    // series.dataFields.categoryY = "team";
    // series.dataFields.valueX = "win";
    // series.tooltipText = "{valueX.value}"
    // series.columns.template.strokeOpacity = 0;
    // series.columns.template.column.cornerRadiusBottomRight = 5;
    // series.columns.maxColumns = 1
    // series.columns.template.column.cornerRadiusTopRight = 5;
    // series.interpolationDuration = stepDuration;
    // series.interpolationEasing = am4core.ease.linear;
    // var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    // labelBullet.label.horizontalCenter = "right";
    // labelBullet.label.text = "{values.valueX.workingValue}";
    // labelBullet.label.textAlign = "end";
    // labelBullet.label.dx = -10;
    // labelBullet.label.maxColumns = 1;
    // chart.zoomOutButton.disabled = true;
    
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
        "1": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "2": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "3": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "4": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "5": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "6": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "7": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "8": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "9": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "10": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "11": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "12": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "13": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "14": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "15": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "16": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
        "17": [{ "team": "BUF", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Buffalo_Bills_logo.svg/189px-Buffalo_Bills_logo.svg.png" },
        { "team": "MIA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Miami_Dolphins_logo.svg/100px-Miami_Dolphins_logo.svg.png" },
        { "team": "NE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/New_England_Patriots_logo.svg/100px-New_England_Patriots_logo.svg.png" },
        { "team": "NYJ", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/New_York_Jets_logo.svg/100px-New_York_Jets_logo.svg.png" },
        { "team": "PIT", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pittsburgh_Steelers_logo.svg/100px-Pittsburgh_Steelers_logo.svg.png" },
        { "team": "BAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Baltimore_Ravens_logo.svg/193px-Baltimore_Ravens_logo.svg.png" },
        { "team": "CLE", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Cleveland_Browns_logo.svg/100px-Cleveland_Browns_logo.svg.png" },
        { "team": "CIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Cincinnati_Bengals_logo.svg/100px-Cincinnati_Bengals_logo.svg.png" },
        { "team": "IND", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Indianapolis_Colts_logo.svg/100px-Indianapolis_Colts_logo.svg.png" },
        { "team": "TEN", win: 0, image: "http://www.nflgamedata.com/ten.png" },
        { "team": "HOU", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Texans_logo.svg/100px-Houston_Texans_logo.svg.png" },
        { "team": "JAX", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jacksonville_Jaguars_logo.svg/100px-Jacksonville_Jaguars_logo.svg.png" },
        { "team": "KC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Kansas_City_Chiefs_logo.svg/100px-Kansas_City_Chiefs_logo.svg.png" },
        { "team": "LV", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Las_Vegas_Raiders_logo.svg/100px-Las_Vegas_Raiders_logo.svg.png" },
        { "team": "LAC", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/NFL_Chargers_logo.svg/100px-NFL_Chargers_logo.svg.png" },
        { "team": "DEN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Denver_Broncos_logo.svg/100px-Denver_Broncos_logo.svg.png" },
        { "team": "WAS", win: 0, image: "http://www.nflgamedata.com/was.png" },
        { "team": "NYG", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/New_York_Giants_logo.svg/100px-New_York_Giants_logo.svg.png" },
        { "team": "DAL", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Dallas_Cowboys.svg/100px-Dallas_Cowboys.svg.png" },
        { "team": "PHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philadelphia_Eagles_logo.svg/100px-Philadelphia_Eagles_logo.svg.png" },
        { "team": "GB", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Green_Bay_Packers_logo.svg/100px-Green_Bay_Packers_logo.svg.png" },
        { "team": "CHI", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chicago_Bears_logo.svg/100px-Chicago_Bears_logo.svg.png" },
        { "team": "MIN", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Minnesota_Vikings_logo.svg/98px-Minnesota_Vikings_logo.svg.png" },
        { "team": "DET", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Detroit_Lions_logo.svg/100px-Detroit_Lions_logo.svg.png" },
        { "team": "NO", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/New_Orleans_Saints_logo.svg/98px-New_Orleans_Saints_logo.svg.png" },
        { "team": "TB", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Tampa_Bay_Buccaneers_logo.svg/100px-Tampa_Bay_Buccaneers_logo.svg.png" },
        { "team": "CAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Carolina_Panthers_logo.svg/100px-Carolina_Panthers_logo.svg.png" },
        { "team": "ATL", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Atlanta_Falcons_logo.svg/192px-Atlanta_Falcons_logo.svg.png" },
        { "team": "SEA", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Seattle_Seahawks_logo.svg/100px-Seattle_Seahawks_logo.svg.png" },
        { "team": "LAR", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Los_Angeles_Rams_logo.svg/100px-Los_Angeles_Rams_logo.svg.png" },
        { "team": "ARI", win: 0, image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/Arizona_Cardinals_logo.svg/179px-Arizona_Cardinals_logo.svg.png" },
        { "team": "SF", win: 0, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/San_Francisco_49ers_logo.svg/100px-San_Francisco_49ers_logo.svg.png" }
        ],
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
