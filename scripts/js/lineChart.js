// class representing the line chart of distance and co-workers

class lineChart {

    constructor(collabDetails, world_aff) {
        this.collabDetails = collabDetails;
        this.world_aff = world_aff;

        this.width = 600;
        this.height = 500;
        this.margin = { 'top': 10, 'bottom': 10, 'left': 50, 'right': 50 };

        this.svg = d3.select('#linechartGroup')
            .append('svg')
            .attr('id', 'linechart')
            .attr('height', this.height)
            .attr('width', this.width);

        this.dist_cowork = [];

        this.projection = d3.geoPatterson();

        this.selected = { 'affs': this.world_aff.map(d => d['aff_name']), 'years': Object.keys(this.collabDetails) };

        this.univ2geo = {};
        this.world_aff.forEach(elem => {
            this.univ2geo[elem['aff_name']] = {
                'lat': elem['lat'],
                'lon': elem['lon'],
            }
        });

        this.link_tip = this.svg.append('g').classed('scatter-tooltip', true)
            .attr('transform', 'translate(' + (this.width / 2) + ',' + (3 * this.margin.top) + ')');

        this.scatterOrLine = 0;
    }

    draw() {
        let dist_cowork = {};

        this.selected.years.forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(univ1 => {
                if (this.selected.affs.indexOf(univ1) != -1) {
                    Object.keys(this.collabDetails[year][univ1]).forEach(univ2 => {
                        let distance = this.univsDistance(univ1, univ2);
                        let univpair = [univ1, univ2].sort().join('___');
                        if (dist_cowork[univpair] === undefined) {
                            dist_cowork[univpair] = {
                                'distance': distance,
                                'coworker': {
                                    'ai': 0,
                                    'interdis': 0,
                                    'system': 0,
                                    'theory': 0,
                                    'total': 0,
                                },
                            };
                        }
                        else {
                            Object.keys(this.collabDetails[year][univ1][univ2]).forEach(area => {
                                dist_cowork[univpair]['coworker'][area] += this.collabDetails[year][univ1][univ2][area];
                            });
                        }

                    });
                }

            });

        });
        console.log('dist_cowork');
        console.log(dist_cowork);
        dist_cowork = Object.keys(dist_cowork).map((univpair) => {
            let r = { 'univpair': univpair, 'distance': dist_cowork[univpair]['distance'], 'coworker': dist_cowork[univpair]['coworker'] };
            return r
        });
        console.log('dist_cowork');
        console.log(dist_cowork);
        dist_cowork = dist_cowork.sort((a, b) => parseFloat(a['distance']) - parseFloat(b['distance']));
        console.log('dist_cowork');
        console.log(dist_cowork);

        console.log([Math.min.apply(null, dist_cowork.map((d) => d['coworker']['total'])),
        Math.max.apply(null, dist_cowork.map((d) => d['coworker']['total']))]);


        let yScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['coworker']['total'])),
            Math.max.apply(null, dist_cowork.map((d) => d['coworker']['total']))])
            .range([this.height - 2 * (this.margin.top + this.margin.bottom), 0]);
        console.log(yScale(3));
        let abc = dist_cowork[0]['coworker']['total']
        console.log(yScale(abc));

        let xScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['distance'])),
            Math.max.apply(null, dist_cowork.map((d) => d['distance']))])
            .range([0, this.width - 2 * (this.margin.right + this.margin.left)]);

        this.svg.selectAll('.axis').remove();
        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisBottom(xScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (this.height - 2 * this.margin.bottom) + ")")
            .append("text")
            .classed('axistext', true)
            .text("distance")
            .attr('fill', 'black')
            .attr('x', this.width - (this.margin.right + this.margin.left))
            .attr('y', this.margin.bottom);

        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (2 * this.margin.top) + ")")
            .append("text")
            .classed('axistext', true)
            .text("co-publication")
            .attr('fill', 'black')
            .attr('x', 2 * this.margin.right)
            .attr('y', -this.margin.top);

        let line = d3.line()
            .x(d => xScale(d.distance))
            .y(d => yScale(d['coworker']['total']));

        d3.selectAll('path.linechart-path').remove();
        this.svg
            .append('g')
            .attr('id', 'linechartpath')
            .attr('class',d=>{
                if(this.scatterOrLine ===1){return 'selected';}
                else{return '';}
            })
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .append("path")
            .datum(dist_cowork)
            .attr("fill", "none")
            .classed('linechart-path', true)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("d", line);

        let that = this;

        d3.selectAll('#line-scatter-checkbox').remove();
        this.svg.append('text')
            .attr('id', 'line-scatter-checkbox')
            .attr('class', d=>{
                if(this.scatterOrLine ===1){return 'checked';}
                else{return '';}
            })
            .text(d=>{
                if(that.scatterOrLine===1){return 'Back to Scatter Chart';}
                else{return 'Show Line Chart';}
            })
            .attr('x', this.width)
            .attr('y', 3 * this.margin.top)
            .on("click", function() { d3.event.stopPropagation(); })
            .on('click.log', d => {
                if (that.scatterOrLine === 0) {
                    that.scatterOrLine = 1;
                    d3.selectAll('#scatter').classed('selected', false);
                    d3.selectAll('#linechartpath').classed('selected', true);
                    d3.select('#line-scatter-checkbox').text('Back to Scatter Chart')
                        .classed('checked', true);
                } else {
                    that.scatterOrLine = 0;
                    d3.selectAll('#scatter').classed('selected', true);
                    d3.selectAll('#linechartpath').classed('selected', false);
                    d3.select('#line-scatter-checkbox').text('Show Line Chart')
                        .classed('checked', false);
                }
            });

        d3.selectAll('circle.scatter-circle').remove();
        this.svg
            .append('g')
            .attr('id', 'scatter')
            .attr('class',d=>{
                if(this.scatterOrLine ===0){return 'selected';}
                else{return '';}
            })
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .selectAll('circle')
            .data(dist_cowork)
            .enter()
            .append('circle')
            .attr('class', d => {
                let major_area = { 'area': 'ai', 'cnt': 0 };
                Object.keys(d.coworker).forEach(area => {
                    if (area != 'total') {
                        if (d.coworker[area] > major_area['cnt']) {
                            major_area = { 'area': area, 'cnt': d.coworker[area] }
                        }
                    }
                });
                return major_area.area;
            })
            .classed('scatter-circle', true)
            .classed('selected', false)
            .attr('r', 5)
            .attr('cx', d => xScale(d.distance))
            .attr('cy', d => yScale(d.coworker.total))
            .attr('stroke', 'red')
            .on('mouseover', (d) => {
                let title_data = [(d.univpair.split('___')[0]), (d.univpair.split('___')[1]), 'Distance: ' + d.distance];
                title_data = title_data.concat(Object.keys(d.coworker).map(area => area + ': ' + d.coworker[area]));
                console.log('title_data')
                console.log(title_data)
                // this.svg.selectAll('g.scatter-tooltip').remove();
                // this.svg.append('g').classed('scatter-tooltip', true)
                //     .attr('transform', 'translate(' + (this.width / 2) + ',' + (3 * this.margin.top) + ')');
                // let link_tip = this.svg.select('.scatter-tooltip');
                this.link_tip.selectAll('rect').remove();
                this.link_tip.selectAll('text').remove();
                this.link_tip.attr('visibility', 'visible');
                this.link_tip.append('rect').attr('rx', 5).attr('width', this.width / 2).attr('height', 30 * 9);
                this.link_tip.selectAll('text').data(title_data).enter().append('text')
                    .attr('class', (d, i) => {
                        switch (i) {
                            case 0:
                                return 'Univ1'
                            case 1:
                                return 'Univ2'
                            case 2:
                                return 'Distance'
                            case 3:
                                return 'AI'
                            case 4:
                                return 'Interdisciplinary'
                            case 5:
                                return 'System'
                            case 6:
                                return 'Theory'
                            case 7:
                                return 'Total'
                        }

                    }).attr('x', (d, i) => 10).attr('y', (d, i) => (i + 1) * 30).text(d => d);

            })
            .on('mouseleave', (d) => {
                this.link_tip.attr('visibility', 'hidden');
            });
    }

    univsDistance(univ1, univ2) {
        let x1, x2, y1, y2;
        x1 = this.projection([this.univ2geo[univ1]['lon'], this.univ2geo[univ1]['lat']])[0];
        x2 = this.projection([this.univ2geo[univ1]['lon'], this.univ2geo[univ1]['lat']])[1];
        y1 = this.projection([this.univ2geo[univ2]['lon'], this.univ2geo[univ2]['lat']])[0];
        y2 = this.projection([this.univ2geo[univ2]['lon'], this.univ2geo[univ2]['lat']])[1];

        return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

    }

    update(activeUniv, activeYear) {
        console.log('activeYear');
        console.log(activeYear);
        console.log(activeUniv);
        // ensure input to be in array form
        if (typeof (activeYear) === 'string') { activeYear = [activeYear]; }
        if (typeof (activeUniv) === 'string') { activeUniv = [activeUniv]; }
        if (activeYear === undefined || activeYear.length === 0) { activeYear = this.selected.years; } else { this.selected.years = activeYear; }
        if (activeUniv === undefined || activeUniv.length === 0) { activeUniv = this.selected.affs; } else { this.selected.affs = activeUniv; }


        let dist_cowork = {};

        this.selected.years.forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(univ1 => {
                if (this.selected.affs.indexOf(univ1) != -1) {
                    Object.keys(this.collabDetails[year][univ1]).forEach(univ2 => {
                        let distance = this.univsDistance(univ1, univ2);
                        let univpair = [univ1, univ2].sort().join('___');
                        if (dist_cowork[univpair] === undefined) {
                            dist_cowork[univpair] = {
                                'distance': distance,
                                'coworker': {
                                    'ai': 0,
                                    'interdis': 0,
                                    'system': 0,
                                    'theory': 0,
                                    'total': 0,
                                },
                            };
                        }
                        else {
                            Object.keys(this.collabDetails[year][univ1][univ2]).forEach(area => {
                                dist_cowork[univpair]['coworker'][area] += this.collabDetails[year][univ1][univ2][area];
                            });
                        }

                    });
                }

            });

        });
        console.log('dist_cowork');
        console.log(dist_cowork);
        dist_cowork = Object.keys(dist_cowork).map((univpair) => {
            let r = { 'univpair': univpair, 'distance': dist_cowork[univpair]['distance'], 'coworker': dist_cowork[univpair]['coworker'] };
            return r
        });
        console.log('dist_cowork');
        console.log(dist_cowork);
        dist_cowork = dist_cowork.sort((a, b) => parseFloat(a['distance']) - parseFloat(b['distance']));
        console.log('dist_cowork');
        console.log(dist_cowork);

        console.log([Math.min.apply(null, dist_cowork.map((d) => d['coworker']['total'])),
        Math.max.apply(null, dist_cowork.map((d) => d['coworker']['total']))]);


        let yScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['coworker']['total'])),
            Math.max.apply(null, dist_cowork.map((d) => d['coworker']['total']))])
            .range([this.height - 2 * (this.margin.top + this.margin.bottom), 0]);
        console.log(yScale(3));
        let abc = dist_cowork[0]['coworker']['total']
        console.log(yScale(abc));

        let xScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['distance'])),
            Math.max.apply(null, dist_cowork.map((d) => d['distance']))])
            .range([0, this.width - 2 * (this.margin.right + this.margin.left)]);

        this.svg.selectAll('.axis').remove();
        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisBottom(xScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (this.height - 2 * this.margin.bottom) + ")")
            .append("text")
            .classed('axistext', true)
            .text("distance")
            .attr('fill', 'black')
            .attr('x', this.width - (this.margin.right + this.margin.left))
            .attr('y', this.margin.bottom);

        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (2 * this.margin.top) + ")")
            .append("text")
            .classed('axistext', true)
            .text("co-publication")
            .attr('fill', 'black')
            .attr('x', 2 * this.margin.right)
            .attr('y', -this.margin.top);

        let line = d3.line()
            .x(d => xScale(d.distance))
            .y(d => yScale(d['coworker']['total']));

        d3.selectAll('path.linechart-path').remove();
        this.svg
            .append('g')
            .attr('id', 'linechartpath')
            .attr('class',d=>{
                if(this.scatterOrLine ===1){return 'selected';}
                else{return '';}
            })
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .append("path")
            .datum(dist_cowork)
            .attr("fill", "none")
            .classed('linechart-path', true)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("d", line);

        let that = this;

        d3.selectAll('#line-scatter-checkbox').remove();
        this.svg.append('text')
            .attr('id', 'line-scatter-checkbox')
            .attr('class', d=>{
                if(this.scatterOrLine ===1){return 'checked';}
                else{return '';}
            })
            .text(d=>{
                if(that.scatterOrLine===1){return 'Back to Scatter Chart';}
                else{return 'Show Line Chart';}
            })
            .attr('x', this.width)
            .attr('y', 3 * this.margin.top)
            .on("click", function() { d3.event.stopPropagation(); })
            .on('click.log', d => {
                if (that.scatterOrLine === 0) {
                    that.scatterOrLine = 1;
                    d3.selectAll('#scatter').classed('selected', false);
                    d3.selectAll('#linechartpath').classed('selected', true);
                    d3.select('#line-scatter-checkbox').text('Back to Scatter Chart')
                        .classed('checked', true);
                } else {
                    that.scatterOrLine = 0;
                    d3.selectAll('#scatter').classed('selected', true);
                    d3.selectAll('#linechartpath').classed('selected', false);
                    d3.select('#line-scatter-checkbox').text('Show Line Chart')
                        .classed('checked', false);
                }
            });

        d3.selectAll('circle.scatter-circle').remove();
        this.svg
            .append('g')
            .attr('id', 'scatter')
            .attr('class',d=>{
                if(that.scatterOrLine===0){return 'selected';}
                else{return '';}
            })
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .selectAll('circle')
            .data(dist_cowork)
            .enter()
            .append('circle')
            .attr('class', d => {
                let major_area = { 'area': 'ai', 'cnt': 0 };
                Object.keys(d.coworker).forEach(area => {
                    if (area != 'total') {
                        if (d.coworker[area] > major_area['cnt']) {
                            major_area = { 'area': area, 'cnt': d.coworker[area] }
                        }
                    }
                });
                return major_area.area;
            })
            .classed('scatter-circle', true)
            .classed('selected', false)
            .attr('r', 5)
            .attr('cx', d => xScale(d.distance))
            .attr('cy', d => yScale(d.coworker.total))
            .attr('stroke', 'red')
            .on('mouseover', (d) => {
                let title_data = [(d.univpair.split('___')[0]), (d.univpair.split('___')[1]), 'Distance: ' + d.distance];
                title_data = title_data.concat(Object.keys(d.coworker).map(area => area + ': ' + d.coworker[area]));
                console.log('title_data')
                console.log(title_data)
                // this.svg.selectAll('g.scatter-tooltip').remove();
                // this.svg.append('g').classed('scatter-tooltip', true)
                //     .attr('transform', 'translate(' + (this.width / 2) + ',' + (3 * this.margin.top) + ')');
                // let link_tip = this.svg.select('.scatter-tooltip');
                this.link_tip.selectAll('rect').remove();
                this.link_tip.selectAll('text').remove();
                this.link_tip.attr('visibility', 'visible');
                this.link_tip.append('rect').attr('rx', 5).attr('width', this.width / 2).attr('height', 30 * 9);
                this.link_tip.selectAll('text').data(title_data).enter().append('text')
                    .attr('class', (d, i) => {
                        switch (i) {
                            case 0:
                                return 'Univ1'
                            case 1:
                                return 'Univ2'
                            case 2:
                                return 'Distance'
                            case 3:
                                return 'AI'
                            case 4:
                                return 'Interdisciplinary'
                            case 5:
                                return 'System'
                            case 6:
                                return 'Theory'
                            case 7:
                                return 'Total'
                        }

                    }).attr('x', (d, i) => 10).attr('y', (d, i) => (i + 1) * 30).text(d => d);

            })
            .on('mouseleave', (d) => {
                this.link_tip.attr('visibility', 'hidden');
            });
    }


}