un = {
	graphs:{},
	charts:{}
}

// Define some graphs
un.graphs.HR = function(){
  console.log("_un.graphs.HR")
  /*
    Initialise a heart rate graph.
  */
  var event = d3.dispatch("crosshair", "zoom");

  var xScale = d3.time.scale();
  var chart = fc.chart.cartesian(xScale
          /*d3.scale.linear(),
          d3.scale.linear()*/)
      .xDomain([0, 170]) // minutes
      .yDomain([0, 120]); // mmHg

  var HRSeries = fc.series.line()
      .xValue(function(d) { return d.time; })
      .yValue(function(d) { return d.value; });

  var multi = fc.series.multi()
      .series([/*gridlines,*/ HRSeries/*, tooltipLayout, crosshairs*/])
      .mapping(function(series) {
          switch (series) {
            /*case crosshairs:
            case tooltipLayout:
              return this.crosshairs;
            case annotation:
              return this.targets;*/
            default:
              return this;
          }
      });

  chart.plotArea(multi);

  function draw(selection) {
      /*
        Draw the heart rate graph onto this selection.
      */
      console.log("_un.graphs.HR.draw")

      selection.each(function(data) {
          chart.xDomain(data.dateDomain)

          var selection = d3.select(this) // can this be put outside 'each'?
              .call(chart);

          // Zoom goes nuts if you re-use an instance and also can"t set
          // the scale on zoom until it"s been initialised by chart.
          var zoom = d3.behavior.zoom()
              .on("zoom", function() {
                  event.zoom.call(this, xScale.domain());
              })
              .x(xScale);

          selection.call(zoom);
      });

  }
  d3.rebind(draw, event, "on");
  return draw;
}

un.graphs.BP = function(){
  console.log("_un.graphs.BP")
  var event = d3.dispatch("crosshair", "zoom");

  var chart = fc.chart.cartesian(
          d3.time.scale(),
          d3.time.scale())
      .xDomain([0, 170]) // minutes
      .yDomain([0, 120]); // mmHg

  var series = fc.series.line()
      .xValue(function(d) { return d.time; })
      .yValue(function(d) { return d.systolic; });

  var multi = fc.series.multi()
      .series([series])
      .mapping(function(series) {
          switch (series) {
          case series:
              return this;
          case annotation:
              return this.targets;
          }
      });

  chart.plotArea(multi);

  function draw(selection) {
      selection.call(chart)
  }
  d3.rebind(draw, event, "on");
  return draw;
}

// Define a vitals chart, using several graphs
un.charts.vs = function(){
  /*
    Initialise a vital signs chart.
  */
  console.log("_un.charts.vs")
  var event = d3.dispatch("navigate", "crosshair");

  /*
  var mainChart = uncharted.graphs.mainChart()
      .on("crosshair", event.crosshair)
      .on("zoom", event.navigate);

  var volumeChart = uncharted.graphs.volumeChart()
      .on("crosshair", event.crosshair);

  var navigatorChart = uncharted.graphs.navigatorChart()
      .on("brush", event.navigate);
  */

  var graphs = {};
  graphs.HR = un.graphs.HR()
      .on("crosshair", event.crosshair)
      .on("zoom", event.navigate);
  graphs.BP = un.graphs.BP()
      .on("crosshair", event.crosshair)
      .on("zoom", event.navigate);
      //.on("brush", event.navigate);

  /*
  container.select("svg.main")
      .datum(visibleData)
      .call(mainChart);

  container.select("svg.volume")
      .datum(visibleData)
      .call(volumeChart);

  container.select("svg.navigator")
      .datum(data)
      .call(navigatorChart);
  */
  var bisector = d3.bisector(function(d) { return d.time; });

  function draw(selection){
      /*
        Draw the vital signs chart onto this selection.
      */
      console.log("_un.charts.vs.draw")
      /*
      selection.select("svg.graph_HR").datum(data.HR)
          .call(HRGraph);
      selection.select("svg.graph_BP").datum(data.BP)
          .call(BPGraph);
      */

      selection.each(function(data) {
        console.log("_un.charts.vs.draw#each")
        // draw each graph:
        for(var graph_i in graphs){
            var visibleData = data[graph_i].slice(
                // Pad and clamp the bisector values to ensure extents can be calculated
                Math.max(0, bisector.left(data[graph_i], data.dateDomain[0]) - 1),
                Math.min(bisector.right(data[graph_i], data.dateDomain[1]) + 1, data[graph_i].length)
            );
            visibleData.dateDomain = data.dateDomain;
            visibleData.crosshairs = data.crosshairs;
            var selection = d3.select(this);
            selection.select("svg.graph_"+graph_i)
                .datum(visibleData)
                .call(graphs[graph_i]);
        }
        /*
        var visibleData = data.slice(
            // Pad and clamp the bisector values to ensure extents can be calculated
            Math.max(0, bisector.left(data, data.dateDomain[0]) - 1),
            Math.min(bisector.right(data, data.dateDomain[1]) + 1, data.length)
        );
        visibleData.dateDomain = data.dateDomain;
        visibleData.crosshairs = data.crosshairs;

        var container = d3.select(this);

        container.select("svg.graph_HR")
            .datum(visibleData)
            .call(HRGraph);

        container.select("svg.graph_BP")
            .datum(visibleData)
            .call(BPGraph);
            */

        /*container.select("svg.navigator")
            .datum(data)
            .call(navigatorChart);*/
      })

  }
  d3.rebind(draw, event, "on");
  return draw;
}


// Make some data
var data = fauxdata.getSomeData(30, false)

data.crosshairs = [];
data.navDateDomain = fc.util.extent().fields("time")([data.HR, data.BP]);
//data.navigatorYDomain = fc.util.extent().fields("close")(data);
var maxDate = data.navDateDomain[1];
var minDate = new Date(data.navDateDomain[0].getTime() + (data.navDateDomain[1].getTime()-data.navDateDomain[0].getTime())*0.8);
data.dateDomain = [minDate, maxDate];

function render() {
    // give the fresh data to the chart and stamp onto the DOM
    d3.select("#practice-chart")
        .datum(data)
        .call(vsChart);
}

// make an instance of the chart
var vsChart = un.charts.vs()
    .on("crosshair", render)
    .on("navigate", function(domain) {
        data.dateDomain = [
            new Date(Math.max(domain[0], data.navDateDomain[0])),
            new Date(Math.min(domain[1], data.navDateDomain[1]))
        ];
        render();
    });

render()
