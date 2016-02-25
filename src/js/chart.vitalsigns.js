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
