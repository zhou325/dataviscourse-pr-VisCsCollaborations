/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param world the full dataset
     * country was updated (clicked)
     */
    constructor(world,world_aff) {
        // ******* TODO: PART I *******
        this.world = world;
        this.world_aff = world_aff;

        this.width = 1400;
        this.height = 800;

        this.map_chart = d3.select("#worldMap");
        this.map_chart.append('svg');

        this.svg = this.map_chart.select('svg')
            .attr('id','worldmap-svg')   
            .attr('height',this.height)
            .attr('width',this.width);
        
        this.group = this.svg.append("g")

        this.displaySize = this.width*0.8;

    }

    drawMap(){            
        let geojson = topojson.feature(this.world, this.world.objects.countries);        
        
        // let projection =  d3.geoWinkel3().scale(130).translate([width / 2, height / 2+100]);
        let projection = d3.geoPatterson()
        
        let path = d3.geoPath()
            .projection(projection);
        this.mapgroup = this.group.append("g")
            .attr("id","mapgroup")
        this.mapgroup.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr('id',d=>d.id)
            .attr('fill','#aaaaaa')
            .attr("transform","scale(1.5)")
            // .on('click',d=>this.updateCountry(d.id));
            .on('click', (d) => {
                console.log(d)
                let center = path.centroid(d);
                console.log(center)
                if(['USA','CAN'].indexOf(d.id)!=-1){
                    this.mapgroup.selectAll('path').classed('clicked', false);
                    d3.select(d3.event.target).classed('clicked', true);
                    this.group
                        .transition(d3.transition().duration(1000))
                        .attr('transform', 'translate(-650,-300),scale(3.8)')
                }
            });
        // let graticule = d3.geoGraticule();
        // this.svg.append('path').datum(graticule).attr('class', "graticule").attr('d', path);
        // this.svg.append('path').datum(graticule.outline).classed('stroke',true).attr('d',path);

        // Load in affiliations data.
        let data = this.world_aff;
        this.circlegroup = this.group.append("g")
                .attr("id","circlegroup")
        this.circlegroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .classed('aff-outer-circle',true)
            .attr("cx", function (d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 3)
            .style("fill", "red")
            .attr('stroke-width',0)
            .attr("transform","scale(1.5)")
            .style("opacity", 0.2)
            .on('click',(d)=>{
                console.log(d);
            });

        this.circlegroup.selectAll("circle .aff-inner-circle")
            .data(data)
            .enter()
            .append("circle")
            .classed('aff-inner-circle',true)
            .attr('id',d=>d.aff_name.replace(' ','-'))
            .attr("cx", function (d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 1)
            .attr('stroke-width',0)
            .style("fill", "yellow")
            .attr("transform","scale(1.5)")
            .style("opacity", 0.8);
    }
}