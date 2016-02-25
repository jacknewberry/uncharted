un.graphs.HR = function(){
  /*
    Initialise a heart rate graph.
  */
  var event = d3.dispatch("crosshair", "zoom");

  var xScale = d3.time.scale();
  var chart = fc.chart.cartesian(xScale)
      //.yDomain([0, 120]); // BPM

  var series = fc.series.line()
      .xValue(function(d) { return d.time; })
      .yValue(function(d) { return d.value; });

  var gridlines = fc.annotation.gridline()
      .xTicks(24) //(d3.time.hours, 2)
      .yTicks(7)

  var crosshairs = fc.tool.crosshair()
      .xLabel("")
      .yLabel("")
      .on("trackingstart.link", event.crosshair)
      .on("trackingmove.link", event.crosshair)
      .on("trackingend.link", event.crosshair)
      .decorate(function(selection){
          selection.select('g.horizontal').remove()
          selection.select('g.point').remove()
      })

  var multi = fc.series.multi()
      .series([gridlines, series, crosshairs/*, tooltipLayout*/])
      .mapping(function(series) {
          switch (series) {
            //case tooltipLayout:
            case crosshairs:
              return this.crosshairs;
            /*case annotation:
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
          var _yDomain = fc.util.extent()
                   .include(0)
                   .fields("value")(data);
          // d3fc extent.include can only include a single value
          if(_yDomain[1] < 120){_yDomain[1] = 120;} // also include 120

          chart.xDomain(data.dateDomain)
               .yDomain(_yDomain)
               .yNice();

          //crosshairs.snap(fc.util.seriesPointSnapXOnly(series, data));

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
