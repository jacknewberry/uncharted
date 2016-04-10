/*
    Add labels to specified data points on a series

    eg. used to label the hightest and lowest values in view

    As far as I can tell there is not a real distinction between d3fc series and annotations. They are both passed to a series.multi and recieve xScale and yScale.
*/

un.annotation.datalabels = function() {
  var decorate = fc.util.fn.noop,
      xScale = d3.time.scale(),
      yScale = d3.scale.linear()

  var datalabels = function(selection) {
      selection.each(function(data, index) {
          //console.log(data); // TODO

          // run a function to determine which points should be labelled.
          // ..or perhaps take a list of points to label in as data

          // to apply a label it needs a time, value, offset and a function to compute the text (usually the value, maybe with units).

          // now apply some labels

          //d3.select(this).datum()
      })
  }

  datalabels.decorate = function(x) {
    if (!arguments.length) {
        return decorate;
    }
    decorate = x;
    return datalabels;
  }
  datalabels.xScale = function(_x) {
      if (!arguments.length) {
          return xScale;
      }
      xScale = _x;
      return datalabels;
  };
  datalabels.yScale = function(_x) {
      if (!arguments.length) {
          return yScale;
      }
      yScale = _x;
      return datalabels;
  };
  return datalabels;
}
