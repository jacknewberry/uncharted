// requires uncharted

un.series.BP = function() {

    var decorate = fc.util.fn.noop;

    var base = fc.series.xyBase();

    var lineData = d3.svg.line()
        .defined(base.defined)
        .x(base.x)
        .y(base.y);

    var dataJoin = fc.util.dataJoin()
        .selector('path.line')
        .element('path')
        .attr('class', 'line');

    var line = function(selection) {

        selection.each(function(data, index) {
            console.log(data)
            var path = dataJoin(this, [data]);
            path.attr('d', lineData); // Update?

            decorate(path, data, index);
        });
    };

    line.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return line;
    };

    d3.rebind(line, base, 'xScale', 'xValue', 'yScale', 'yValue');
    d3.rebind(line, dataJoin, 'key');
    d3.rebind(line, lineData, 'interpolate', 'tension');

    return line;


    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        y0Value = d3.functor(0),
        x0Value = d3.functor(0),
        xValue = function(d, i) { return d.x; },
        yValue = function(d, i) { return d.y; };

    function base() { }

    base.x0 = function(d, i) {
        return xScale(x0Value(d, i));
    };
    base.y0 = function(d, i) {
        return yScale(y0Value(d, i));
    };
    base.x = base.x1 = function(d, i) {
        return xScale(xValue(d, i));
    };
    base.y = base.y1 = function(d, i) {
        return yScale(yValue(d, i));
    };

    base.defined = function(d, i) {
        return defined(x0Value, y0Value, xValue, yValue)(d, i);
    };

    base.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return base;
    };
    base.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return base;
    };
    base.x0Value = function(x) {
        if (!arguments.length) {
            return x0Value;
        }
        x0Value = d3.functor(x);
        return base;
    };
    base.y0Value = function(x) {
        if (!arguments.length) {
            return y0Value;
        }
        y0Value = d3.functor(x);
        return base;
    };
    base.xValue = base.x1Value = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = d3.functor(x);
        return base;
    };
    base.yValue = base.y1Value = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = d3.functor(x);
        return base;
    };

    return base;

}
