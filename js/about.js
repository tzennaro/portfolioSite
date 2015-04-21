'use strict';

d3.json('./data/about.json', function (error, data) {
	var width = 1110,
		height = 1372,
		margin = 75,
		parseDate = d3.time.format("%Y-%m-%d").parse,
		svg = d3.select('#about-graph-container')
				.append('svg')
				.attr("viewBox", "0 0 " + width + " " + height)
				.attr("preserveAspectRatio", "xMaxYMin")
				.attr("meetOrSlice", "meet")
				.append('g')
				.attr('id', 'about-graph-group');
		
		svg.append("clipPath")
			.attr("id", "about-area")
			.append("rect")
			.attr("x", '0')
			.attr("y", margin)
			.attr("width", width)
			.attr("height", height - (margin * 2));

//		startDate = d3.min(data, function (d, i) { return parseDate(d.dateStart); }),
	var startDate = parseDate('2008-08-01'),
//		endDate = d3.max(data, function (d, i) { return parseDate(d.dateEnd); }),

		today = new Date(),
		dd = today.getDate(),
		mm = today.getMonth()+1,
		yyyy = today.getFullYear();
	if(dd<10) { dd='0'+dd; }
	if(mm<10) { mm='0'+mm; }
	var endDate = parseDate(yyyy+'-'+mm+'-'+dd);

	var yScale = d3.time.scale()
					.domain([startDate, endDate])
					.range([height - margin, margin]),

		xScale = d3.scale.ordinal()
					.domain(['education', 'work', 'experience', 'interests'])
					.rangeRoundBands([margin, width-margin]),

		projectScale = d3.scale.ordinal()
						.domain(["rect-sscs", "rect-typemetrics", "rect-blackmountaincollege_infographics", "rect-atlas_urbino", "rect-wttc", "rect-death_in_venice", "rect-sansavenir"])
						.range(["#sscs", "#typemetrics", "#blackmountaincollege_infographics", "#atlas_urbino", "#wttc_infographics", "#death_in_venice", "#sansavenir"]),

//		education = textures.lines()
//					.lighter()
//					.thicker()
//					.orientation("3/8")
//					.stroke("#F4F7F5")
//					.background("#FF3F4C"),
//
//		work = textures.lines()
//					.lighter()
//					.thicker()
//					.orientation("3/8")
//					.stroke("#F4F7F5")
//					.background("#72ff80"),
//		
//		experience = textures.lines()
//					.lighter()
//					.thicker()
//					.orientation("3/8")
//					.stroke("#F4F7F5")
//					.background("#59d0ff"),

		//X Axis creation
		xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("top"),

		//Y Axis creation
		yAxis = d3.svg.axis()
					.scale(yScale)
					.ticks(20)
					.tickFormat(d3.time.format("%b '%y"))
					.orient("left");

	var dataTypes = _.uniq(data.map(function (d) { return d.type; }));

	//RECTANGLES
	svg.selectAll('.rectGroup')
		.data(dataTypes)
		.enter()
		.append('g')
		.attr('class', 'rectGroup')
		.attr("clip-path", "url(#about-area)")
		.attr('id', function (d) { return 'rect-' + d; });
	
	svg.selectAll('.textGroup')
		.data(dataTypes)
		.enter()
		.append('g')
		.attr('class', 'textGroup')
		.attr('id', function (d) { return 'text-' + d; });

		svg.selectAll('.rectGroup')
			.each(function (d) {
				var idGroup = this.id;
				var dataFilter = data.filter(function (d) { 
						if (idGroup === 'rect-education') { return d.type === 'education'; }
						else if (idGroup === 'rect-work') { return d.type === 'work'; }
						else if (idGroup === 'rect-experience') { return d.type === 'experience'; }
						else if (idGroup === 'rect-interests') { return d.type === 'interests'; }
					});
				d3.select(this)
					.selectAll('rect')
					.data(dataFilter)
					.enter()
					.append('rect')
					.attr({
						'id': function (d) { return d.id; },
						'class': function () { return 'sub' + idGroup; },
						'x': function (d, i) {
							if (d.type === "work" || d.type === 'education') { return xScale(d.type); }
							else if (d.type === "interests") { return (xScale(d.type) + ((xScale.rangeBand() / (dataFilter.length)) + 5) * i) + ((xScale.rangeBand() / (dataFilter.length) / 2)) - 5; }
							else { return xScale(d.type) + ((xScale.rangeBand() / (dataFilter.length)) * i); }
						},
						'y': function (d) { return yScale(parseDate(d.dateEnd)); },
						'height': function (d) { return (yScale(parseDate(d.dateStart)) - yScale(parseDate(d.dateEnd))); },
						'width': function (d) { 
							if (d.type === 'education') { return (xScale.rangeBand()) - 2; }
							else if (d.type === "work") { return xScale.rangeBand() - 2; }
							else if (d.type === "interests") { return 2; }
							else { return (xScale.rangeBand() / dataFilter.length) - 2; }
						},
//						'fill': function (d) {
//							if (d.type === "education") { svg.call(education); return education.url(); }
//							else if (d.type === "work") { svg.call(work); return work.url(); }
//							else if (d.type === "experience") { svg.call(experience); return experience.url(); }
//							else if (d.type === "interests") { return '#353531'; }
//						},
						'fill': function (d) {
							if (d.type === "education") { return '#FF3F4C'; }
							else if (d.type === "work") { return '#72ff80'; }
							else if (d.type === "experience") { return '#59d0ff'; }
							else if (d.type === "interests") { return '#353531'; }
						},
						'opacity': 0.35
					});

				if (this.id === 'rect-interests') {
					d3.select(this)
						.selectAll('circle')
						.data(dataFilter)
						.enter()
						.append('circle')
						.attr({
							'cy': function (d) { 
										if (parseDate(d.dateStart) <= startDate) { return height - margin + 5; }
										else { return yScale(parseDate(d.dateStart)) + 4; }
							},
							'cx': function (d, i) {
								return (xScale(d.type) + ((xScale.rangeBand() / (dataFilter.length)) + 5) * i) + ((xScale.rangeBand() / (dataFilter.length) / 2)) - 4; 
							},
							'r': 4,
							'stroke': '#353531',
							'stroke-width': 2,
							'fill': '#F4F7F5',
							'opacity': 0.35
						});
				}

				if (this.id === 'rect-work') {
					d3.select(this)
						.selectAll('rect')
						.on('mouseover', function () {
							d3.select(this)
								.transition()
								.duration(150)
								.attr({
									'cursor':'pointer',
									'stroke': '#353531',
									'stroke-width': 1
								});
						})
						.on('mouseout', function () {
							d3.select(this)
								.transition()
								.duration(150)
								.attr({
									'stroke': '#353531',
									'stroke-width': 0
								});
						})
						.on('click', function (d) {
							$(projectScale(d.id)).modal();
						});
				}
			});

		svg.selectAll('.textGroup')
			.each(function (d) {
				var idGroup = this.id;
				var dataFilter = data.filter(function (d) { 
						if (idGroup === 'text-education') { return d.type === 'education'; }
						else if (idGroup === 'text-work') { return d.type === 'work'; }
						else if (idGroup === 'text-experience') { return d.type === 'experience'; }
						else if (idGroup === 'text-interests') { return d.type === 'interests'; }
					});
				var labels = d3.select(this)
								.selectAll('text')
								.data(dataFilter)
								.enter()
								.append('text')
								.attr({
									'font-family': 'FontAwesome, Roboto, serif',
									'pointer-events': 'none',
									'font-weight': 'regular',
									'font-size': '11px',
									'color': '#353531',
									'class': function (d) { return 'labelClass-' + d.type; },
									'x': function (d, i) {
										if (d.type === "work" || d.type === 'education') { return xScale(d.type);}
										else if (d.type === "experience") {  return xScale(d.type) + ((xScale.rangeBand() / (dataFilter.length)) * i); }
										else { return (xScale(d.type) + ((xScale.rangeBand() / (dataFilter.length)) + 5) * i) + ((xScale.rangeBand() / (dataFilter.length) / 2)) - 1; }
									},
									'y': function (d, i) { 
										if (parseDate(d.dateStart) <= startDate) { return height - margin - 2 - (15 * i); }
										else { return yScale(parseDate(d.dateStart)) - 2; }
									}
								})
								.text(function (d) {
									if (d.type === "interests") { return d.icon + ' ' + d.name; }
									else { return d.name; }
									return d.name
								});

				function wrap(text, width) {
					text.each(function(d) {
						var text = d3.select(this),
							words = text.text().split(/\s+/).reverse(),
							word,
							line = [],
							lineNumber = 0,
							lineHeight = 1.2,
							x = text.attr("x"),
							y = text.attr("y"),
							dy = text.attr("dy") ? text.attr("dy") : 0;
						var tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
						while (word = words.pop()) {
							line.push(word);
							tspan.text(line.join(" "));
							if (tspan.node().getComputedTextLength() > width) {
								line.pop();
								tspan.text(line.join(" "));
								line = [word];
								tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
							}
						}
					});
				}

				if (labels.attr('class') === "labelClass-work" || labels.attr('class') === 'labelClass-education') { labels.call(wrap, xScale.rangeBand()); }
				else if (labels.attr('class') === "labelClass-experience") { labels.call(wrap, (xScale.rangeBand() / 1.5)); }
			});

		//X Axis generator
		svg.append("g")
			.attr("class", "axis")
			.attr("id", "xaxis")
			.attr("transform", "translate(0, " + margin + ")")
			.call(xAxis);

		//Y Axis generator
		svg.append("g")
			.attr("class", "axis")
			.attr("id", "yaxis")
			.attr("transform", "translate(" + margin + ", 0)")
			.call(yAxis);

});