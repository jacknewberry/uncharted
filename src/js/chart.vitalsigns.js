"use-strict";

un.charts.vs = function(templateSelection){
  /*
    Initialise a vital signs chart.
  */
  var event = d3.dispatch("navigate", "crosshair");

  /*
  var navigatorChart = uncharted.graphs.navigatorChart()
      .on("brush", event.navigate);
  */

  var graphs = {};
  // parse the template selection and make graphs depending on the HTML
  templateSelection.selectAll(".graph")
    .each(function(d, i){
      /*
        the dataset variable retrieves any custom HTML 'data-' attributes.
        see: http://bl.ocks.org/mbostock/1323729
        Trick for young players: dataset is only available on HTML elements, not on <svg>. Thus the template html uses <div> tags for charts.
      */
      //console.log(this.id)
      //console.log(this.dataset)
      //console.log(this.dataset.graph)
      graphs[this.id] = un.graphs[this.dataset.graph]()
          .on("crosshair", event.crosshair)
          .on("zoom", event.navigate);
          //.on("brush", event.navigate);
      graphs[this.id].datalabel = this.dataset.datalabel;

    })

  var bisector = d3.bisector(function(d) { return d.time; });

  function draw(selection){
      /*
        Draw the vital signs chart onto this selection.
      */
      selection.each(function(data) {
        // draw each graph:
        for(var graph_i in graphs){
            var _data = data[graphs[graph_i].datalabel];
            var visibleData = _data.slice(
                // Pad and clamp the bisector values to ensure extents can be calculated
                Math.max(0, bisector.left(_data, data.dateDomain[0]) - 1),
                Math.min(bisector.right(_data, data.dateDomain[1]) + 1, _data.length)
            );
            visibleData.dateDomain = data.dateDomain;
            visibleData.crosshairs = data.crosshairs;

            var selection = d3.select(this);

            // Don't draw un-pinned graphs if there is no data in-view:
            if(visibleData.length <= 2){
              // TODO - this test is inacccurate and will lose the first and last item in the series.
              console.log(selection.select("#"+graph_i))
              selection.select("#"+graph_i)
                  .style("opacity", 0);
              continue;
            }

            selection.select("#"+graph_i)
                .datum(visibleData)
                .call(graphs[graph_i]);
        }
      })

  }
  d3.rebind(draw, event, "on");
  return draw;
}
