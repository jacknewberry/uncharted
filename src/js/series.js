// requires uncharted

/*
  Draw a 'double arrow' blood pressure style series
  - draw only one end of the arrows if the data is incomplete

  Based on a merge of d3fc xyBase into d3fc line,
     with influence from d3fc d3fc/src/svg/errorBar.js
*/
un.series.BP = function() {

    // initialise defaults
    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        //y0Value = d3.functor(0), // I don't know what these are for.
        //x0Value = d3.functor(0), // I don't know what these are for.
        // These methods retrieve the values to be graphed from the data:
        // (not to be confused with methods x, high and low, which return the values transformed by the scale)
        xValue = function(d, i) { return d.time; },
        yHighValue = function(d, i) { return d.high; };
        yLowValue = function(d, i) { return d.low; };
    var decorate = fc.util.fn.noop;

    var dataJoin = fc.util.dataJoin()
        .selector('path.line')
        .element('path')
        .attr('class', 'line');

    var series = function(selection) {
        selection.each(function(data, index) {
            var path = dataJoin(this, [data]);
            path.attr('d', lineData); // D3 'Update'

            decorate(path, data, index);
        });
    };

    series.x = function(d, i) {
        return xScale(xValue(d, i));
    };
    series.high = function(d, i) {
        return yScale(yHighValue(d, i));
    };
    series.low = function(d, i) {
        return yScale(yLowValue(d, i));
    };

    var lineData = un.SVG.BPLineGenerator()
        .x(series.x)
        .high(series.high)
        .low(series.low);

    series.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return series;
    };

    d3.rebind(series, dataJoin, 'key');

    // Add Getter-Setters:

    /* // I don't know what these are useful for.
    series.x0 = function(d, i) {
        return xScale(x0Value(d, i));
    };
    series.y0 = function(d, i) {
        return yScale(y0Value(d, i));
    };*/

    series.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return series;
    };
    series.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return series;
    };
    /* // IDon't know what these are useful for.
    series.x0Value = function(x) {
        if (!arguments.length) {
            return x0Value;
        }
        x0Value = d3.functor(x);
        return series;
    };
    series.y0Value = function(x) {
        if (!arguments.length) {
            return y0Value;
        }
        y0Value = d3.functor(x);
        return series;
    };*/
    series.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = d3.functor(x);
        return series;
    };
    series.yHighValue = function(x) {
        if (!arguments.length) {
            return yHighValue;
        }
        yHighValue = d3.functor(x);
        return series;
    };
    series.yLowValue = function(x) {
        if (!arguments.length) {
            return yLowValue;
        }
        yLowValue = d3.functor(x);
        return series;
    };

    return series;
}


un.SVG.BPLineGenerator = function(){
    /*
    SVG line generator for blood-pressure style 'double arrow' graphs.
                                  |
     |        |     |             |             |
     |    |   |     |   |    |    |     |   |   |     |
     |    |   |         |    |          |   |         |
          |             |               |

          (you have to imagine the arrows)

    Process a sequence of x, high and low values into an SVG path
    the SVG path is described in the SVG path mini-language for use as the 'd' attr. see: https://www.dashingd3js.com/svg-paths-and-d3js

    similar to d3.svg.line and d3fc/src/svg/errorBar.js

    - missing high or low values result in only the other arrow being drawn.
    - future: draw plain lines for data too close to fit arrows.
    */
    var x = function(d, i) { return d.x; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        arrowWidth = d3.functor(4),
        arrowHeight = d3.functor(5);

    var generator = function(data) {
        return data.map(function(d, i, data) {
            /*
              d is this datum, i is its index, data is the whole data array.
            */
            var _x = Math.floor(x(d, i))+0.5, // to produce crisp edges with antialised arrows.
                _aWidth = arrowWidth(d, i),
                halfWidth = _aWidth / 2,
                _aHeight = arrowHeight(d, i),
                _high = high(d, i),
                _low = low(d, i),
                height = _high - _low;

            var SVGString = ""
            // if there is a top value, draw a top arrow
            if(!isNaN(_high)){ // There has to be a better test.
                SVGString += 'M' + (_x-halfWidth) +','+ (_high+_aHeight) +
                             'l' + halfWidth +','+ (-_aHeight) +
                             'l' + halfWidth +','+ _aHeight
            }
            // then a bottom arrow
            if(!isNaN(_low)){
                SVGString += 'M' + (_x-halfWidth) +','+ (_low-_aHeight) +
                             'l' + halfWidth +','+ _aHeight +
                             'l' + halfWidth +','+ (-_aHeight)
            }
            // then the connecting line
            if(!isNaN(_high) && !isNaN(_low)){
                SVGString += 'M' + _x + ',' + _high +
                             'v' + (-height)
            }
            return SVGString;
        })
        .join('');
    };
    generator.x = function(__) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(__);
        return generator;
    };
    generator.high = function(__) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(__);
        return generator;
    };
    generator.low = function(__) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(__);
        return generator;
    };
    generator.arrowWidth = function(__) {
        if (!arguments.length) {
            return arrowWidth;
        }
        arrowWidth = d3.functor(__);
        return generator;
    };
    generator.arrowHeight = function(__) {
        if (!arguments.length) {
            return arrowHeight;
        }
        arrowHeight = d3.functor(__);
        return generator;
    };
    return generator;
}
