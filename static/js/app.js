// Bar Graph
d3.json("./static/data/2020_season_stats.json", function(data){
    console.log(data)

    var team = data[1].TeamName;
    var pointsFor = data[1].Score/16;
    var pointsAgainst;
    var touchdowns = data[1].Touchdowns;
    var totRec;
    var totRush;
    var fumbles;

    console.log(team);
    console.log(pointsFor);
    console.log(touchdowns);
      
});

// append team names to HTML dropdown option

d3.json("./static/data/standings.json", function(data){
    // console.log(data)

    for (var i =0; i<data.length; i++) {
        var dropdownOption = d3.select("select");
        dropdownOption.append("option")
            .append("option").text(`${data[i].Team} - ${data[i].Name}`)
    };

});

//create event listner

d3.select("select").on("change", updateVisuals)


function updateVisuals() {
    console.log("it worked for now...");
    var team = d3.select("select").property("value")
    console.log(team);
};

// Diverging Bar graph for team statistics

// End Diverging Bar Graph




// Mike Tyburczy Bubble Graph - Beginning



var w = 1777, h = 500;
    
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
    
    var stepDuration = 5000;
    
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

  console.log(allData);

  chart.data = JSON.parse(JSON.stringify(allData[week]));
  categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

  series.events.on("inited", function () {
    setTimeout(function () {
      playButton.isActive = true; // this starts interval
    }, 2000)
  })
    
});
