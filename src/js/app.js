// requires uncharted

// Define some graphs
un.graphs.HR = function(){
  /*
    Initialise a heart rate graph.
  */
  var event = d3.dispatch("crosshair", "zoom");

  var xScale = d3.time.scale();
  var chart = fc.chart.cartesian(xScale)
      .yDomain([0, 120]); // BPM

  var series = fc.series.line()
      .xValue(function(d) { return d.time; })
      .yValue(function(d) { return d.value; });

  var multi = fc.series.multi()
      .series([/*gridlines,*/ series/*, tooltipLayout, crosshairs*/])
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
  var event = d3.dispatch("crosshair", "zoom");

  var xScale = d3.time.scale();
  var chart = fc.chart.cartesian(xScale)
      .yDomain([0, 200]); // mmHg

  var series = un.series.BP()
      .xValue(function(d) { return d.time; })
      .yHighValue(function(d) { return d.systolic; })
      .yLowValue(function(d) { return d.diastolic; });

  var multi = fc.series.multi()
      .series([/*gridlines,*/ series/*, tooltipLayout, crosshairs*/])
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
      Draw the blood pressure graph onto this selection.
    */

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

// Define a vitals chart, using several graphs
un.charts.vs = function(){
  /*
    Initialise a vital signs chart.
  */
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
      selection.each(function(data) {
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
var data = fauxdata.getSomeData(50, false)

data.crosshairs = [];
data.navDateDomain = fc.util.extent().fields("time")([data.HR, data.BP]);
//data.navigatorYDomain = fc.util.extent().fields("close")(data);
var maxDate = data.navDateDomain[1];
var minDate = new Date(data.navDateDomain[0].getTime() + (data.navDateDomain[1].getTime()-data.navDateDomain[0].getTime())*0.8);
data.dateDomain = [minDate, maxDate];

// fc.util.render waits until the next 'requestAnimationFrame'
var render = fc.util.render(function() {
    // give the fresh data to the chart and stamp onto the DOM
    d3.select("#practice-chart")
        .datum(data)
        .call(vsChart);
});

// make an instance of the chart
var vsChart = un.charts.vs()
    .on("crosshair", render)
    .on("navigate", function(domain) {
        data.dateDomain = [
            new Date(Math.max(domain[0], data.navDateDomain[0])),
            new Date(Math.min(domain[1], data.navDateDomain[1]))
        ];
        render()
    });

render()

$(window).resize(render);
