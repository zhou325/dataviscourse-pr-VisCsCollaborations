/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param world the full dataset
     * country was updated (clicked)
     */
    constructor(world,world_aff,population,collabDetails, updateUniv) {
        this.world = world;
        this.world_aff = world_aff;
        this.population = population;
        this.nameArray = this.population.map(d => d.geo.toUpperCase());
        this.regionArray = this.population.map(d=>d.region);
        this.collabDetails = collabDetails;
        this.updateUniv = updateUniv;

        this.width = 1400;
        this.height = 800;
        this.margin = {'top':10,'bottom':10,'left':30,'right':30};


        this.map_chart = d3.select("#worldMap");
        this.map_chart.append('svg');

        this.svg = this.map_chart.select('svg')
            .attr('id','worldmap-svg')   
            .attr('height',this.height)
            .attr('width',this.width);
        
        this.group = this.svg.append("g")

        this.displaySize = this.width*0.8;
        this.ifZoomedIn = false;

        // Intialize tool-tip
        this.tip = d3.tip();
        this.tip.attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })

        this.link_tip = d3.tip();
        this.link_tip.attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            });

        // for update map, default year selection is all the years
        this.selected = {'aff_geo':undefined,'years':undefined};

    }

    // tooltip html render for inner nodes
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  +'tooltip-' + tooltip_data['aff_name'] + " >" + tooltip_data['aff_name'] + "</h2>";
        text += "<h3 class ="  +'tooltip-' + tooltip_data['aff_name'] + " >" +'Co-publication:' + tooltip_data['copub'] + "</h2>";
        return text;
    }

    // tooltip html render for links
    linktip_render(linktip_data) {
        let text = "<h3 class ="  +'linktip-' + linktip_data['aff_name'] + " >" + linktip_data['aff1_geo'].aff_name + "</h2>";
        text += "<h3 class ="  +'linktip-' + linktip_data['aff_name'] + " >" + linktip_data['aff2_geo'].aff_name + "</h2>";
        text += "<h4 class ="  +'linktip-' + linktip_data['aff_name'] + " >" +'Co-publication:' + linktip_data['area_cnt']['total'] + "</h2>";
        return text;
    }

    drawMap(){            
        this.svg.call(this.tip);
        this.tip.html((d)=>{
             return this.tooltip_render(d);
            });
        this.svg.call(this.link_tip);
        this.link_tip.html((d)=>{
                return this.linktip_render(d);
            })
            .style("left", d=>1 + "px")     
            .style("top", d=>1 + "px");

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
            .style("opacity","0.4")
            .on('click', (d) => {
                if(this.ifZoomedIn === false){
                    this.mapgroup.selectAll('path').classed('clicked', false);
                    d3.select(d3.event.target).classed('clicked', true);
                    if(d.region === 'northamericas'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-650,-300),scale(3.8)');
                        this.ifZoomedIn = true;
                        this.selected.aff_geo = undefined;
                        // this.updateMap(this.selected);
                    }
                    if(d.region === 'americas'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-1200,-1200),scale(3.5)');
                        this.ifZoomedIn = true;
                        this.selected.aff_geo = undefined;
                        // this.updateMap(this.selected);
                    }
                    if(d.region === 'europe'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-2000,-200),scale(3.5)');
                        this.ifZoomedIn = true;
                        this.selected.aff_geo = undefined;
                        // this.updateMap(this.selected);
                    }
                    if(d.region === 'asia'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-2000,-350),scale(2.5)');
                        this.ifZoomedIn = true;
                        this.selected.aff_geo = undefined;
                        // this.updateMap(this.selected);
                    }
                    if(d.region === 'oceania'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-3000,-1100),scale(3)');
                        this.ifZoomedIn = true;
                        this.selected.aff_geo = undefined;
                        // this.updateMap(this.selected);
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

        // groups, the latter will be the upper
        this.linkgroup = this.group.append('g')
            // .attr("transform","scale(1.5)")
            .attr('id','linkgroup');
        this.circlegroup = this.group.append("g")
            .attr("id","circlegroup");
        this.yeargroup = this.svg.append('g').attr('id','yeargoup').attr('transform','translate(0,'+(this.height-this.margin.bottom)+')')

        console.log('this.world_aff');
        console.log(this.world_aff);
        // data for link, and total co-pub for node
        let node_data = this.world_aff;
        let link_data = Array();
        console.log('this.collabDetails');
        console.log(this.collabDetails);
        Object.keys(this.collabDetails).forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(aff1 => {
                // if(link_data[aff1]===undefined){link_data[aff1] = {};}
                Object.keys(this.collabDetails[year][aff1]).forEach(aff2 => {
                    node_data.forEach(data_elem => {
                        // console.log('this.collabDetails[year]');
                        // console.log(this.collabDetails[year]);
                        // console.log(this.collabDetails[year][aff1]);
                        // console.log(this.collabDetails[year][aff1][aff2]);
                        // console.log(this.collabDetails[year][aff1][aff2]['total']);
                        if(data_elem.aff_name === aff1){
                            if(data_elem['copub'] === undefined){data_elem['copub']=this.collabDetails[year][aff1][aff2]['total'];}
                            else{data_elem['copub']+=this.collabDetails[year][aff1][aff2]['total'];}
                        }
                        
                    });
                    let aff1aff2 = [aff1,aff2].sort();
                    if(link_data[aff1aff2]===undefined){
                        link_data[aff1aff2] = {};
                        let aff1_geo,aff2_geo; 
                        node_data.forEach(element => {
                            if(element.aff_name === aff1){
                                aff1_geo = element;
                            }
                            if(element.aff_name === aff2){
                                aff2_geo = element;
                            }
                        });
                        if(aff1_geo!=undefined && aff2_geo!=undefined){
                            link_data[aff1aff2] = {
                                'aff1_geo':aff1_geo,
                                'aff2_geo':aff2_geo,
                            }
                        }
                        if(link_data[aff1aff2]['area_cnt'] === undefined){link_data[aff1aff2]['area_cnt'] = this.collabDetails[year][aff1][aff2] ;}
                        else{
                            Object.keys(this.collabDetails[year][aff1][aff2]).forEach(area => {
                                link_data[aff1aff2]['area_cnt'][area] += this.collabDetails[year][aff1aff2][area];
                            });
                        }
                    }
                });
            });
        });
        let link_data_copy = link_data;
        link_data = [];
        Object.keys(link_data_copy).forEach(aff1aff2 => {
            link_data.push(link_data_copy[aff1aff2]);
        });

        // append outer and inner nodes on map 
        // this.circlegroup.selectAll("circle")
        //     .data(node_data)
        //     .enter()
        //     .append("circle")
        //     .classed('aff-outer-circle',true)
        //     .attr("cx", function (d) {
        //         return projection([d.lon, d.lat])[0];
        //     })
        //     .attr("cy", function (d) {
        //         return projection([d.lon, d.lat])[1];
        //     })
        //     .attr("r", (d)=>Math.min(Math.sqrt(d.copub/20),5))
        //     // .style("fill", "mediumturquoise")
        //     .attr('stroke-width',0)
        //     .attr("transform","scale(1.5)")
        //     // .style("opacity", 0.2);
        // let circles = this.circlegroup.selectAll("circle .aff-inner-circle")
        //     .data(node_data);
        // circles.exit().remove();
        // let newcircles = circles.enter().append("circle");
        // circles = newcircles.merge(circles);
        // circles
        //     .classed('aff-inner-circle',true)
        //     .attr('id',d=>d.aff_name.replace(' ','-'))
        //     .attr("cx", function (d) {
        //         return projection([d.lon, d.lat])[0];
        //     })
        //     .attr("cy", function (d) {
        //         return projection([d.lon, d.lat])[1];
        //     })
        //     // .attr("r", 0.5)
        //     .attr("r", (d)=>Math.min(Math.sqrt(d.copub/20),5)*0.5)
        //     .attr('stroke-width',0)
        //     // .style("fill", "yellow")
        //     .attr("transform","scale(1.5)")
        //     .style("opacity", 0.8)
        //     .on('mouseover',this.tip.show)
        //     .on('mouseleave',this.tip.hide)
        //     .on('click',(d)=>{
        //         this.selected.aff_geo = d;
        //         this.updateMap(this.selected);
        //         this.updateUniv(d.aff_name);
        //     });

        // console.log('link_data');
        // console.log(link_data);

        // append links on map
        // this.linkgroup.selectAll('path')
        //     .data(link_data)
        //     .enter()
        //     .append('path')
        //     .on('mouseover',this.link_tip.show)
        //     .on('mouseleave',this.link_tip.hide)
        //     .attr('class',d=>{
        //         let classstr1 = 'link-'+d['aff1_geo'].aff_name;
        //         classstr1 = classstr1.replace(/\s+/g,''); 
        //         let classstr2 = 'link-'+d['aff2_geo'].aff_name;
        //         classstr2 = classstr2.replace(/\s+/g,'');
        //         let major_area = 'ai';
        //         if(d['area_cnt']['system']>d['area_cnt'][major_area]){major_area = 'system';}
        //         if(d['area_cnt']['theory']>d['area_cnt'][major_area]){major_area = 'theory';}
        //         if(d['area_cnt']['interdis']>d['area_cnt'][major_area]){major_area = 'interdis';}
        //         return classstr1 + ' ' + classstr2 + ' '+ major_area +' '+ 'aff-link' + ' ' + 'unselected'
        //     })
        //     .attr('d',d=>{
        //         return 'M ' + projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[0] +' '+projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[1]
        //         + ' L ' + projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[0] +' '+projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[1]
        //     })
        //     .attr('id',d=>{
        //         let idstr = 'link-'+d['aff1_geo'].aff_name+'-'+d['aff2_geo'].aff_name;
        //         idstr = idstr.replace(/\s+/g,''); 
        //         return d;
        //     })
        //     .attr('opacity',d=>{
        //         if(d['area_cnt']['total']>5){return 5;}
        //         else{return d['area_cnt']['total']/5;}
        //     })
        //     .attr('stroke-width',0.5);



        // append years text on bottom of map
        let year_array = Object.keys(this.collabDetails);
        let yearScale = d3.scaleLinear()
            .domain([Math.min.apply(null,year_array),
                Math.max.apply(null,year_array)])
            .range([0.5*(this.margin.left), this.width - this.margin.right]);
        this.yeargroup.selectAll('text')
            .data(year_array)
            .enter()
            .append('text')
            .classed('year-text',true)
            .attr('x',(d)=>yearScale(d))
            .attr('y',0)
            .text(d=>d);
        let that = this;
        // append years brush on bottom of map
        d3.selectAll('#brush-year').remove();
        this.svg.append('g')
            .attr('id','brush-year')
            .attr("class", "brush")
            .call(
                d3.brushX()
                    .extent([[0, this.height-this.margin.bottom*3], [this.width, this.height]])
                    .on("end", function(){
                        if (!d3.event.sourceEvent) return; // Only transition after input.
                        if (!d3.event.selection) return; // Ignore empty selections.
                        let selectedRange = d3.event.selection;
                        let selectedElems = [];
                        console.log('selectedRange')
                        console.log(selectedRange);
                        let year_array = Object.keys(that.collabDetails);
                        year_array.forEach(year => {
                            if(yearScale(year)>=selectedRange[0] && yearScale(year)<=selectedRange[1]){
                                selectedElems.push(year);
                            }
                        // console.log('selectedElems');
                        // console.log(selectedElems);
                        that.selected.years = selectedElems;
                        });
                that.updateMap(undefined, that.selected.years);
                }));


    }

    updateMap(activeUniv, activeYear){
        let projection = d3.geoPatterson()

        if(activeYear===undefined){activeYear = Object.keys(this.collabDetails)};

        // data for link, and total co-pub for node
        let node_data = this.world_aff;
        console.log('node_data');
        console.log(node_data);
        let link_data = Array();
        node_data.forEach(elem => {
            elem.copub = 0;
        });
        activeYear.forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(aff1 => {
                Object.keys(this.collabDetails[year][aff1]).forEach(aff2 => {
                    node_data.forEach(data_elem => {
                        if(data_elem.aff_name === aff1){
                            if(data_elem['copub'] === undefined){data_elem['copub']=this.collabDetails[year][aff1][aff2]['total'];}
                            else{data_elem['copub']+=this.collabDetails[year][aff1][aff2]['total'];}
                        }
                            
                    });
                    let aff1aff2 = [aff1,aff2].sort();
                    if(link_data[aff1aff2]===undefined){
                        link_data[aff1aff2] = {};
                        let aff1_geo,aff2_geo; 
                        node_data.forEach(element => {
                            if(element.aff_name === aff1){
                                aff1_geo = element;
                                }
                            if(element.aff_name === aff2){
                                aff2_geo = element;
                                }
                        });
                        if(aff1_geo!=undefined && aff2_geo!=undefined){
                            link_data[aff1aff2] = {
                                'aff1_geo':aff1_geo,
                                'aff2_geo':aff2_geo,
                            }
                        }
                        if(link_data[aff1aff2]['area_cnt'] === undefined){link_data[aff1aff2]['area_cnt'] = this.collabDetails[year][aff1][aff2] ;}
                        else{
                            Object.keys(this.collabDetails[year][aff1][aff2]).forEach(area => {
                                link_data[aff1aff2]['area_cnt'][area] += this.collabDetails[year][aff1aff2][area];
                            });
                        }
                    }
                });
            });
        });
            
        console.log('node_data');
        console.log(node_data);
        let link_data_copy = link_data;
        link_data = [];
        Object.keys(link_data_copy).forEach(aff1aff2 => {
                link_data.push(link_data_copy[aff1aff2]);
        });

    // change outer nodes on map 
    // this.circlegroup.selectAll(".aff-outer-circle").remove();
        // this.circlegroup.selectAll("circle .aff-outer-circle")
        //     .data(node_data)
        //     .enter()
        //     .append("circle")
        //     .classed('aff-outer-circle',true)
        //     .attr("cx", function (d) {
        //         return projection([d.lon, d.lat])[0];
        //     })
        //     .attr("cy", function (d) {
        //         return projection([d.lon, d.lat])[1];
        //     })
        //     .attr("r", (d)=>Math.min(Math.sqrt(d.copub/20),5))
        //     // .style("fill", "mediumturquoise")
        //     .attr('stroke-width',0)
        //     .attr("transform","scale(1.5)")
        //     // .style("opacity", 0.2);
    let circles = this.circlegroup.selectAll("circle")
        .data(node_data);
    circles.exit().remove();
    let newcircles = circles.enter().append("circle");
    circles = newcircles.merge(circles);
    circles
        .attr("class","aff-inner-circle")
        .attr('id',d=>d.aff_name.replace(' ','-'))
        .attr("cx", function (d) {
            return projection([d.lon, d.lat])[0];
            })
        .attr("cy", function (d) {
            return projection([d.lon, d.lat])[1];
            })
        // .attr("r", 0.5)
        .attr("r", (d)=>Math.min(Math.sqrt(d.copub/20),5)*0.6)
        .attr('stroke-width',0)
        .attr("transform","scale(1.5)")
        .style("opacity", 0.6)
        .on('mouseover',this.tip.show)
        .on('mouseleave',this.tip.hide)
        .on('click',(d)=>{
            console.log(d)
            this.updateMap(d.aff_name, activeYear);
            this.updateUniv(d.aff_name);
        });

    // change links on map
    let llinks = this.linkgroup.selectAll("path")
        .data(link_data);
    llinks.exit().remove();
    let newlinks = llinks.enter().append("path");
    llinks = newlinks.merge(llinks);
    // this.linkgroup.selectAll('.aff-link').remove();
    llinks
        .on('mouseover',this.link_tip.show)
        .on('mouseleave',this.link_tip.hide)
        .attr('class',d=>{
            let classstr1 = 'link-'+d['aff1_geo'].aff_name;
            classstr1 = classstr1.replace(/\s+/g,''); 
            let classstr2 = 'link-'+d['aff2_geo'].aff_name;
            classstr2 = classstr2.replace(/\s+/g,'');
            let major_area = 'ai';
            if(d['area_cnt']['system']>d['area_cnt'][major_area]){major_area = 'system';}
            if(d['area_cnt']['theory']>d['area_cnt'][major_area]){major_area = 'theory';}
            if(d['area_cnt']['interdis']>d['area_cnt'][major_area]){major_area = 'interdis';}
            return classstr1 + ' ' + classstr2 + ' '+ major_area +' '+ 'aff-link' + ' ' + 'unselected'
        })
        .attr('d',d=>{
            return 'M ' + projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[0] +' '+projection([d['aff1_geo'].lon, d['aff1_geo'].lat])[1]
            + ' L ' + projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[0] +' '+projection([d['aff2_geo'].lon, d['aff2_geo'].lat])[1]
        })
        .attr('id',d=>{
            let idstr = 'link-'+d['aff1_geo'].aff_name+'-'+d['aff2_geo'].aff_name;
            idstr = idstr.replace(/\s+/g,''); 
            return idstr;
        })
        .attr('opacity',d=>{
            if(d['area_cnt']['total']>5){return 5;}
                else{return d['area_cnt']['total']/5;}
        })
        .attr("transform","scale(1.5)")
        .attr('stroke-width',0.5);

        if(activeUniv===undefined){
            d3.selectAll('.aff-link')
                .classed('selected', false);
            d3.selectAll('.aff-link')
                .classed('unselected', true);
        }
        else{
            let aff_geo = node_data[node_data.map(d=>d.aff_name).indexOf(activeUniv)]
            d3.selectAll('.aff-link')
                .classed('unselected',true)
            console.log('aff_geo');
            console.log(aff_geo);
            let classstr = 'link-'+aff_geo.aff_name.replace(/\s+/g,'')
            console.log('classstr');
            console.log(classstr);
            d3.select("#linkgroup").selectAll('.'+classstr)
                .classed('unselected',false)
                .classed('selected', true);                
        }
    }
}