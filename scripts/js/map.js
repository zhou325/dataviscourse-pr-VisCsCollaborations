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

    }

    drawMap(){
        let world = this.world;
            
        let geojson = topojson.feature(world, world.objects.countries);

        let map_chart = d3.select("#worldMap");
        map_chart.append('svg');
        
        let width = 2000;
        let height = 2000;
        let svg = map_chart.select('svg')
            .attr('id','worldmap-svg')   
            .attr('height',height)
            .attr('width',width);

        let projection = d3.geoWinkel3().scale(300).translate([width / 2, height / 2+100]);
        
        let path = d3.geoPath()
            .projection(projection);
        svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr('id',d=>d.id)
            .attr('fill','#aaaaaa')
            .on('click',d=>this.updateCountry(d.id));
        let graticule = d3.geoGraticule();
        svg.append('path').datum(graticule).attr('class', "graticule").attr('d', path);
        svg.append('path').datum(graticule.outline).classed('stroke',true).attr('d',path);

        // Load in affiliations data.
        let data = this.world_aff;
        
        d3.select("#worldmap-svg").selectAll("circle")
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
            .attr("r", 5)
            .style("fill", "red")
            .attr('stroke-width',0)
            .style("opacity", 0.2);

        d3.select("#worldmap-svg").selectAll("circle .aff-inner-circle")
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
            .style("opacity", 0.8);
    }


}