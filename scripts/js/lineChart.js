// class representing the line chart of distance and co-workers

class lineChart {

    constructor(collabDetails, world_aff) {
        this.collabDetails = collabDetails;
        this.world_aff = world_aff;

        this.width = 800;
        this.height = 1000;
        this.margin = { 'top': 10, 'bottom': 10, 'left': 30, 'right': 30 };

        this.svg = d3.select('body').append('div')
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

    }

    draw() {
        let dist_cowork = {};

        Object.keys(this.collabDetails).forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(univ1 => {
                Object.keys(this.collabDetails[year][univ1]).forEach(univ2 => {
                    let distance = this.univsDistance(univ1, univ2);
                    if (dist_cowork[distance] === undefined) { dist_cowork[distance] = 1; }
                    else { dist_cowork[distance] += 1; }

                });

            });

        });

        dist_cowork = Object.keys(dist_cowork).map((dist) => {
            let r = { 'distance': dist, 'coworker': dist_cowork[dist] };
            return r
        });
        dist_cowork = dist_cowork.sort((a, b) => parseFloat(a['distance']) - parseFloat(b['distance']));

        let yScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['coworker'])),
            Math.max.apply(null, dist_cowork.map((d) => d['coworker']))])
            .range([this.height - 2 * (this.margin.top + this.margin.bottom), 0]);

        let xScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['distance'])),
            Math.max.apply(null, dist_cowork.map((d) => d['distance']))])
            .range([0, this.width - 2 * (this.margin.right + this.margin.left)]);


        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisBottom(xScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (this.height - 2 * this.margin.bottom) + ")")
            .append("text")
            .classed('axistext',true)
            .text("distance")
            .attr('fill', 'black')
            .attr('x', this.width - (this.margin.right + this.margin.left))
            .attr('y', this.margin.bottom);

        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (2 * this.margin.top) + ")")
            .append("text")
            .classed('axistext',true)
            .text("coworkers")
            .attr('fill', 'black')
            .attr('x', 2*this.margin.right)
            .attr('y', -this.margin.top);

        let line = d3.line()
            .x(d => xScale(d.distance))
            .y(d => yScale(d.coworker))

        this.svg
            .append('g')
            .attr('id', 'linechartpath')
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .append("path")
            .datum(dist_cowork)
            .attr("fill", "none")
            .classed('linechart-path',true)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("d", line);

        this.scatterOrLine = 0;
        let that = this;

        this.svg.append('text')
            .attr('id','line-scatter-checkbox')
            .classed('checked',true)
            .text('Show Scatter Chart')
            .attr('x',this.width-20*this.margin.right)
            .attr('y',3*this.margin.top)
            .on('click',d=>{
                if(that.scatterOrLine === 0){
                    that.scatterOrLine = 1;
                    d3.selectAll('#scatter').classed('selected',false);
                    d3.selectAll('#linechartpath').classed('selected',true);
                    d3.select('#line-scatter-checkbox').text('Show Scatter Chart')
                        .classed('checked',false);
                }else{
                    that.scatterOrLine = 0;
                    d3.selectAll('#scatter').classed('selected',true);
                    d3.selectAll('#linechartpath').classed('selected',false);
                    d3.select('#line-scatter-checkbox').text('Back to Line Chart')
                        .classed('checked',true);
                }
            })

        this.svg
            .append('g')
            .attr('id','scatter')
            .classed('selected',true)
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .selectAll('circle')
            .data(dist_cowork)
            .enter()
            .append('circle')
            .classed('scatter-circle',true)
            .classed('selected',false)
            .attr('r',1)
            .attr('cx',d=>xScale(d.distance))
            .attr('cy',d=>yScale(d.coworker))
            .attr('stroke','red');
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
        if (activeUniv === undefined || activeUniv.length === 0) { activeUniv = this.selected.affs; }else{this.selected.affs = activeUniv;}


        let dist_cowork = {};

        this.selected.years.forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(univ1 => {
                if(this.selected.affs.indexOf(univ1)!=-1){
                    Object.keys(this.collabDetails[year][univ1]).forEach(univ2 => {
                        let distance = this.univsDistance(univ1, univ2);
                        if (dist_cowork[distance] === undefined) { dist_cowork[distance] = 1; }
                        else { dist_cowork[distance] += 1; }
    
                    });
                }

            });

        });

        console.log('dist_cowork');
        console.log(dist_cowork);

        dist_cowork = Object.keys(dist_cowork).map((dist) => {
            let r = { 'distance': dist, 'coworker': dist_cowork[dist] };
            return r
        });
        dist_cowork = dist_cowork.sort((a, b) => parseFloat(a['distance']) - parseFloat(b['distance']));

        let yScale = d3.scaleLinear()
            .domain([Math.min.apply(null, dist_cowork.map((d) => d['coworker'])),
            Math.max.apply(null, dist_cowork.map((d) => d['coworker']))])
            .range([this.height - 2 * (this.margin.top + this.margin.bottom), 0]);

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
            .text("distance")
            .attr('fill', 'black')
            .attr('x', this.width - (this.margin.right + this.margin.left))
            .attr('y', this.margin.bottom);

        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale).ticks(10))
            .attr("transform", "translate(" + this.margin.left + "," + (2 * this.margin.top) + ")")
            .append("text")
            .text("coworkers")
            .attr('fill', 'black')
            .attr('x', 0)
            .attr('y', -this.margin.top);

        let line = d3.line()
            .x(d => xScale(d.distance))
            .y(d => yScale(d.coworker))

        d3.selectAll('path.linechart-path').remove();
        this.svg
            .append('g')
            .attr('id', 'linechartpath')
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .append("path")
            .datum(dist_cowork)
            .attr("fill", "none")
            .classed('linechart-path',true)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        let that = this;

        d3.selectAll('#line-scatter-checkbox').remove();
        this.svg.append('text')
            .attr('id','line-scatter-checkbox')
            .classed('checked',true)
            .text('Show Scatter Chart')
            .attr('x',this.width-20*this.margin.right)
            .attr('y',3*this.margin.top)
            .on('click',d=>{
                if(that.scatterOrLine === 0){
                    that.scatterOrLine = 1;
                    d3.selectAll('#scatter').classed('selected',false);
                    d3.selectAll('#linechartpath').classed('selected',true);
                    d3.select('#line-scatter-checkbox').text('Show Scatter Chart')
                        .classed('checked',false);
                }else{
                    that.scatterOrLine = 0;
                    d3.selectAll('#scatter').classed('selected',true);
                    d3.selectAll('#linechartpath').classed('selected',false);
                    d3.select('#line-scatter-checkbox').text('Back to Line Chart')
                        .classed('checked',true);
                }
            })

        d3.selectAll('circle.scatter-circle').remove();
        this.svg
            .append('g')
            .attr('id','scatter')
            .attr("transform", "translate(" + this.margin.left + ',' + (2 * this.margin.top) + ")")
            .selectAll('circle')
            .data(dist_cowork)
            .enter()
            .append('circle')
            .classed('scatter-circle',true)
            .classed('selected',false)
            .attr('r',10)
            .attr('cx',d=>xScale(d.distance))
            .attr('cy',d=>yScale(d.coworker))
            .attr('stroke','red');
        if(this.scatterOrLine===1){
            d3.selectAll('#scatter').classed('selected',false);
            d3.selectAll('#linechartpath').classed('selected',true);
            d3.select('#line-scatter-checkbox').text('Show Scatter Chart')
                .classed('checked',false);
        }else{
            d3.selectAll('#scatter').classed('selected',true);
            d3.selectAll('#linechartpath').classed('selected',false);
            d3.select('#line-scatter-checkbox').text('Back to Line Chart')
                .classed('checked',true);
        }
    }


}