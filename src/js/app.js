// requires uncharted

/*
    This file is a little chaotic
    it should do the least possible to instantiate a chart onto the DOM.
*/
var data = fauxdata.getSomeData(150, false)


// Prepare the chart settings on the data
data.crosshairs = [];
data.navDateDomain = fc.util.extent().fields("time")([data.HR, data.BP]);
//data.navigatorYDomain = fc.util.extent().fields("close")(data);

// set the initial domain:
var maxDate = data.navDateDomain[1];
data.targetZoom = 4*60 // minutes per 100px
data.targetZoom *= 24*10; // ms/px
// TODO set the chart to a desired scale, rather than a percentage of the data.
var minDate = new Date(data.navDateDomain[0].getTime() + (data.navDateDomain[1].getTime()-data.navDateDomain[0].getTime())*0.8);
data.dateDomain = [minDate, maxDate];


/*
  The d3fc framework does not try to make rendering optimisations, it is expected that the whole chart will be re-rendered after any change.
  see https://d3fc.io/components/introduction/component-design.html

  This is a potential source of lag for the user, expecially running on older hospital machines or mobile devices.
  I'm choosing to ignore it for the moment.
*/
// fc.util.render waits until the next 'requestAnimationFrame'
var render = fc.util.render(function() {
    // give the fresh data to the chart and stamp onto the DOM
    d3.select("#practice-chart")
        .datum(data)
        .call(vsChart);
});

// make an instance of the chart:
var vsChart = un.charts.vs(d3.select("#practice-chart"))
    .on("crosshair", render) // it would be faster if this didn't re-render the whole chart.
    .on("navigate", function(domain) {

        data.dateDomain = [
            new Date(domain[0]),
            new Date(Math.min(domain[1], data.navDateDomain[1]))
        ];
        render()
    });

render()

$(window).resize(render);
