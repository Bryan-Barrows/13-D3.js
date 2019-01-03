// set up chart size
var svgWidth = 960;
var svgHeight = 500;

// margins
var margin = {
	top: 20,
	bottom: 60,
	right: 40,
	left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// create an svg wrapper, append an svg that will hold the chart
var svg = d3
	.select('.chart')
	.append('svg')
	.attr('height', svgHeight)
	.attr('width', svgWidth)
	.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`);

// append svg group
var chart = svg.append('g');

// append a div to the body to create tooltips, assign to class
d3.select('.chart').append('div').attr('class','tooltip').style('opacity',0);

// read csv
d3.csv('../../data/data.csv', function(err, healthData) {
	if(err) throw err;

	healthData.forEach(function(data) {
		data.obesity = +data.obesity;
		data.smokes = +data.smokes;
	});

	// create scale functions
	var yLinearScale = d3.scaleLinear().range([height, 0]);
	var xLinearScale = d3.scaleLinear().range([0, width]);

	// create axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// scale the domain
	var xMin;
	var xMax;
	var yMin;
	var yMax;

	xMin = d3.min(healthData, function(data) {
		return +data.obesity * 0.95;
	});

	xMax = d3.max(healthData, function(data) {
		return +data.obesity * 1.05;
	});

	yMin = d3.min(healthData, function(data) {
		return +data.smokes * 0.98;
	});

	yMax = d3.max(healthData, function(data) {
		return +data.smokes * 1.02;
	});

	// set the domain of the axes
	xLinearScale.domain([xMin, xMax]);
	yLinearScale.domain([yMin, yMax]);


	// initialize tooltip
	var toolTip = d3.tip()
		.attr('class', 'tooltip')
		.offset([80,-60])
		.html(function(data) {
			var stateName = data.state;
			var ob = +data.obesity;
			var smoke = +data.smokes;
			return (stateName + '<br> Obesity: ' + ob + '% <br> Smoking: ' + smoke + '%');
		});

	// create tooltip
	chart.call(toolTip);

	chart.selectAll('circle')
		.data(healthData)
		.enter()
		.append('circle')
		.attr('cx', function(data, index) {
			return xLinearScale(data.obesity)
		})
		.attr('cy', function(data,index) {
			return yLinearScale(data.smokes)
		})
		.attr('r','15')
		.attr('fill','lightblue')
		.attr('opacity', 0.75)
		//display tooltip on click
		.on('mouseenter', function(data) {
			toolTip.show(data);
		})
		.on('mouseout', function (data, index) {
			toolTip.hide(data);
		});

	// appending a label to each data point
	chart.append('text')
		.style('text-anchor', 'middle')
		.style('font-size','12px')
		.selectAll('tspan')
		.data(healthData)
		.enter()
		.append('tspan')
			.attr('x', function(data) {
				return xLinearScale(data.obesity - 0);
			})
			.attr('y', function(data) {
				return yLinearScale(data.smokes - 0.2);
			})
			.text(function(data) {
				return data.abbr
			});

	// append svg group for x-axis and display
	chart
		.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(bottomAxis);

	// append svg group for y-axis and display
	chart.append('g').call(leftAxis);

	// append y-axis label
	chart
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y',0-margin.left + 40)
		.attr('x', 0 - height/2)
		.attr('dy','1em')
		.attr('class','axis-text')
		.text('Smoking (%)')

	// append x-axis label
	chart
		.append('text')
		.attr('transform','translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')')
		.attr('class','axis-text')
		.text('Obesity (%)');

});

