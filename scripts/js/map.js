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

    }


    tooltip_render(tooltip_data) {
        console.log('tooltip_data');
        console.log(tooltip_data);
        let text = "<h2 class ="  +'tooltip-' + tooltip_data['aff_name'] + " >" + tooltip_data['aff_name'] + "</h2>";
        text += "<h3 class ="  +'tooltip-' + tooltip_data['aff_name'] + " >" +'Co-publication:' + tooltip_data['total_pub'] + "</h2>";

        return text;
    }

    linktip_render(linktip_data) {
        console.log('linktip_data');
        console.log(linktip_data);
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
                        this.updateMap(undefined);
                    }
                    if(d.region === 'americas'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-1200,-1200),scale(3.5)');
                        this.ifZoomedIn = true;
                        this.updateMap(undefined);
                    }
                    if(d.region === 'europe'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-2000,-200),scale(3.5)');
                        this.ifZoomedIn = true;
                        this.updateMap(undefined);
                    }
                    if(d.region === 'asia'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-2000,-350),scale(2.5)');
                        this.ifZoomedIn = true;
                        this.updateMap(undefined);
                    }
                    if(d.region === 'oceania'){
                        this.group
                            .transition(d3.transition().duration(1000))
                            .attr('transform', 'translate(-3000,-1100),scale(3)');
                        this.ifZoomedIn = true;
                        this.updateMap(undefined);
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

        this.linkgroup = this.group.append('g')
        .attr("transform","scale(1.5)")
        .attr('id','linkgroup');

        console.log('this.world_aff');
        console.log(this.world_aff);
        // Load in affiliations data.
        let data = this.world_aff;


        // data for link, and total co-pub for node
        let link_data = Array();
        console.log('this.collabDetails');
        console.log(this.collabDetails);
        Object.keys(this.collabDetails).forEach(year => {
            Object.keys(this.collabDetails[year]).forEach(aff1 => {
                // if(link_data[aff1]===undefined){link_data[aff1] = {};}
                Object.keys(this.collabDetails[year][aff1]).forEach(aff2 => {
                    data.forEach(data_elem => {
                        // console.log('this.collabDetails[year]');
                        // console.log(this.collabDetails[year]);
                        // console.log(this.collabDetails[year][aff1]);
                        // console.log(this.collabDetails[year][aff1][aff2]);
                        // console.log(this.collabDetails[year][aff1][aff2]['total']);
                        if(data_elem.aff_name === aff1){
                            if(data_elem['total_pub'] === undefined){data_elem['total_pub']=this.collabDetails[year][aff1][aff2]['total'];}
                            else{data_elem['total_pub']+=this.collabDetails[year][aff1][aff2]['total'];}
                        }
                        
                    });
                    let aff1aff2 = [aff1,aff2].sort();
                    if(link_data[aff1aff2]===undefined){
                        link_data[aff1aff2] = {};
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
        console.log('data');
        console.log(data);
        let link_data_copy = link_data;
        link_data = [];
        Object.keys(link_data_copy).forEach(aff1aff2 => {
            link_data.push(link_data_copy[aff1aff2]);
        });

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
            .attr("r", (d)=>Math.min(Math.sqrt(d.total_pub/20),5))
            .style("fill", "mediumturquoise")
            .attr('stroke-width',0)
            .attr("transform","scale(1.5)")
            .style("opacity", 0.2);

        let venue2area = {
            'aaai':'AI',
            'ijcai':'AI',
            'cvpr':'AI',
            'eccv':'AI',
            'iccv':'AI',
            'icml':'AI',
            'kdd':'AI',
            'nips':'AI',
            'acl':'AI',
            'emnlp':'AI',
            'naacl':'AI',
            'sigir':'AI',
            'www':'AI',

            'asplos':'System',
            'isca':'System',
            'micro':'System',
            'hpca':'System',
            'sicomm':'System',
            'nsdi':'System',
            'ccs':'System',
            'oakland':'System',
            'usenixatc':'System',
            'ndss':'System',
            'sigmod':'System',
            'vldb':'System',
            'icde':'System',
            'pods':'System',
            'dac':'System',
            'iccad':'System',
            'emsoft':'System',
            'rtas':'System',
            'rtss':'System',
            'hpdc':'System',
            'ics':'System',
            'sc':'System',
            'mobicom':'System',
            'mobisys':'System',
            'sensys':'System',
            'imc':'System',
            'sigmetrics':'System',
            'osdi':'System',
            'sosp':'System',
            'eurosys':'System',
            'fast':'System',
            'usenixsec':'System',
            'pldi':'System',
            'popl':'System',
            'icfp':'System',
            'oopsla':'System',
            'fse':'System',
            'icse':'System',
            'ase':'System',
            'issta':'System',
            
            'focs':'Theory',
            'soda':'Theory',
            'stoc':'Theory',
            'crypto':'Theory',
            'eurocrypt':'Theory',
            'cav':'Theory',
            'lics':'Theory',

            'ismb':'Interdisciplinary',
            'recomb':'Interdisciplinary',
            'siggraph':'Interdisciplinary',
            'siggraph-asia':'Interdisciplinary',
            'ec':'Interdisciplinary',
            'wine':'Interdisciplinary',
            'chi':'Interdisciplinary',
            'ubicomp':'Interdisciplinary',
            'uist':'Interdisciplinary',
            'icra':'Interdisciplinary',
            'iros':'Interdisciplinary',
            'vis':'Interdisciplinary',
            'vr':'Interdisciplinary',
        }


        console.log('link_data');
        console.log(link_data);

        this.linkgroup.selectAll('path')
            .data(link_data)
            .enter()
            .append('path')
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
                return d;
            })
            .attr('opacity',d=>{
                if(d['area_cnt']['total']>5){return 5;}
                else{return d['area_cnt']['total']/5;}
            })
            .attr('stroke-width',0.5);

        
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
            .attr("r", 0.5)
            .attr('stroke-width',0)
            .style("fill", "yellow")
            .attr("transform","scale(1.5)")
            .style("opacity", 0.8)
            .on('mouseover',this.tip.show)
            .on('mouseleave',this.tip.hide)
            .on('click',(d)=>{
                this.updateMap(d);
            });
        }

        updateMap(aff_geo){
            console.log('aff_geo');
            console.log(aff_geo);
            if(aff_geo===undefined){
                console.log('undefined');
                d3.selectAll('.aff-link')
                    .classed('selected', false);
                d3.selectAll('.aff-link')
                    .classed('unselected', true);
            }
            else{
                d3.selectAll('.aff-link')
                    .classed('unselected',true)
                console.log('aff_geo');
                console.log(aff_geo);
                let classstr = 'link-'+aff_geo.aff_name.replace(/\s+/g,'')
                console.log('classstr');
                console.log(classstr);
                d3.selectAll('.'+classstr)
                    .classed('unselected',false)
                    .classed('selected', true);    
            }
    }
}