/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param world the full dataset
     * country was updated (clicked)
     */
    constructor(world,world_aff,population,collabDetails) {
        this.world = world;
        this.world_aff = world_aff;
        this.population = population;
        this.nameArray = this.population.map(d => d.geo.toUpperCase());
        this.regionArray = this.population.map(d=>d.region);
        this.collabDetails = collabDetails;

        console.log(this.nameArray)

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
        this.ifZoomedIn = false;

    }

    drawMap(){            
        let geojson = topojson.feature(this.world, this.world.objects.countries); 
        
        let countries = geojson.features;

        for(let i=0;i<countries.length;i++){
            if(['USA','CAN','MEX','DOM','GTM','CUB','HND','HTI','NIC','CRI','SLV','BLZ','JAM','PAN','BHS'].indexOf(countries[i].id)!=-1){
                countries[i].region = "northamericas"
            }
            else if (['AUS','NZL'].indexOf(countries[i].id)!=-1){
                countries[i].region = "oceania"
            }
            else if(this.nameArray.indexOf(countries[i].id)!=-1){
                countries[i].region = this.regionArray[this.nameArray.indexOf(countries[i].id)];
            } else {
                countries[i].region = "outside"
            }
        } 

        console.log(countries)
        
        // let projection =  d3.geoWinkel3().scale(130).translate([width / 2, height / 2+100]);
        let projection = d3.geoPatterson()
        
        let path = d3.geoPath()
            .projection(projection);
        this.mapgroup = this.group.append("g")
            .attr("id","mapgroup")
        this.mapgroup.selectAll("path")
            .data(countries)
            .enter()
            .append("path")
            .attr("d", path)
            .attr('id',d=>d.id)
            .attr('class',d=>d.region)
            .attr("transform","scale(1.5)")
            .style("opacity","0.6")
            // .on('click',d=>this.updateCountry(d.id));
            .on('click', (d) => {
                console.log(d)
                if(this.ifZoomedIn === false){
                    // let center = path.centroid(d);
                    this.mapgroup.selectAll('path').classed('clicked', false);
                    d3.select(d3.event.target).classed('clicked', true);
                    if(d.region === 'northamericas'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-650,-300),scale(3.8)');
                        this.ifZoomedIn = true;
                    }
                    if(d.region === 'americas'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-1200,-1200),scale(3.5)');
                        this.ifZoomedIn = true;
                    }
                    if(d.region === 'europe'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-2000,-200),scale(3.5)');
                        this.ifZoomedIn = true;
                    }
                    if(d.region === 'asia'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-2000,-350),scale(2.5)');
                        this.ifZoomedIn = true;
                    }
                    if(d.region === 'oceania'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-3000,-1100),scale(3)');
                        this.ifZoomedIn = true;
                    }
                }
                else{
                    this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'scale(1)')
                    this.ifZoomedIn = false;
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

            console.log('this.world_aff');
            console.log(this.world_aff);
            let link_data = Array();
    
            Object.keys(this.collabDetails).forEach(aff1 => {
                Object.keys(this.collabDetails[aff1]).forEach(aff2 => {
                    let aff1_geo,aff2_geo; 
                    data.forEach(element => {
                        if(element.aff_name === aff1){
                            aff1_geo = element;
                        }
                        if(element.aff_name === aff2){
                            aff2_geo = element;
                        }
                    });
                    if(aff1_geo!=undefined && aff2_geo!=undefined){
                        let weight = this.collabDetails[aff1][aff2]; 
                        let elem = {
                            'aff1_geo':aff1_geo,
                            'aff2_geo':aff2_geo,
                            'weight':weight
                        }
                        link_data.push(elem)
                    }
                });
            });
    
        console.log('link_data');
        console.log(link_data);
        this.linkgroup = this.group.append('g')
            .attr("transform","scale(1.5)")
            .attr('id','linkgroup');
        this.linkgroup.selectAll('path')
            .data(link_data)
            .enter()
            .append('path')
            .classed('aff_link',true)
            .attr('d',d=>{
                return 'M ' + projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[0] +' '+projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[1]
                + ' L ' + projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[0] +' '+projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[1]
            })
            .attr('id',d=>{
                return 'M ' + projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[0] +' '+projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[1]
                + ' L ' + projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[0] +' '+projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[1];
            })
            .style("opacity", 0.1)
            .attr('stroke','yellow')
            .attr('stroke-width','0.1');
    }
}