var svgHeight = 500;
var svgWidth = 900;

var margin = {
    top: 50,
    right: 50,
    bottom: 30,
    left: 50
};

var height = svgHeight-margin.top-margin.bottom;
var width = svgWidth-margin.right-margin.left;

console.log(width/2)

var svg = d3.select("#david-graph")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.json("./static/data/2020_season_stats.json", function(data) {

    console.log(data);

    var teamStats = {};
    var leagueStats = {};

    for (var i = 0; i<data.length; i++) {
        if (data[i].Team === "JAX") {
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
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .attr("transform", `translate(${width/2}, ${height})`)
    .call(bottomRight);      

chartGroup.append("g")
    .attr("transform", `translate(${width/2},0)`)
    .call(middleAxis);


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
          .style("fill","blue");

    var passing = chartGroup.selectAll(".bar2")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 35)
        .attr("x", (width/2)-(Object.values(teamStats)[9]*400)/5000)   
        .attr("width", (Object.values(teamStats)[9]*400)/5000)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");

    var receiving = chartGroup.selectAll(".bar5")
        .data(Object.values(teamStats))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", 140)
        .attr("x", (width/2)-(Object.values(teamStats)[3]*400/300))       
        .attr("width", Object.values(teamStats)[3]*400/300)
        .attr("height", 30)
        .style("opacity", .2)
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");

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
        .style("fill","blue");
    
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
        .attr("width", (Object.values(leagueStats)[9]*400)/5000)
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
        .attr("width", Object.values(leagueStats)[3]*400/300)
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