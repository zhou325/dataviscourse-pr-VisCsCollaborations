class ForceDirected{
    constructor(collabDetails, updateUniv, updateYear){
        this.collabDetails = collabDetails;
        this.updateUniv = updateUniv;
        this.updateYear = updateYear;

        this.width = 800;
        this.height = 800;

        this.svg = d3.select("#forceDirected").append("svg")
            .attr('id','forcedirected-svg')   
            .attr('height',this.height)
            .attr('width',this.width);

        console.log(collabDetails)

    }
    drawGraph(){


    }
    updateGraph(activeunivList, activeYear){
        console.log(activeunivList, activeYear)
        // console.log(selected)
        // let univlist = selected.affs
        // let univdetail = selected.aff_geo
        // if(activeYear===undefined){activeYear = Object.keys(this.collabDetails)};
        // let link_data = {};
        // let univlist = [];
        // activeYear.forEach(year=>{
        //     if(Object.keys(this.collabDetails[year]).indexOf(activeUniv)!=-1){
        //         Object.keys(this.collabDetails[year][activeUniv]).forEach(univ => {
        //             if(univlist.indexOf(univ)===-1){
        //                 univlist.push(univ);
        //                 link_data[univ] = {'source': activeUniv, 'target':univ,'totalcoPub':0, 
        //                 'ai':0,'system':0,'theory':0,'interdis':0,'major_area':undefined};
        //             }
        //             let coll = this.collabDetails[year][activeUniv][univ];
        //             link_data[univ]['ai'] += coll.ai;
        //             link_data[univ]['system'] += coll.system;
        //             link_data[univ]['theory'] += coll.theory;
        //             link_data[univ]['interdis'] += coll.interdis;
        //             link_data[univ]['totalcoPub'] += coll.total;
        //         })
        //     }
        // })
        // let link_data_new = [];
        // Object.keys(link_data).forEach(univ=>{
        //     link_data[univ]['major_area'] = 'ai';
        //     if(link_data[univ].system > link_data[univ].ai){
        //         link_data[univ]['major_area'] = 'system';
        //     }
        //     if(link_data[univ].theory > link_data[univ].system){
        //         link_data[univ]['major_area'] = 'theory';
        //     }
        //     if(link_data[univ].interdis > link_data[univ].theory){
        //         link_data[univ]['major_area'] = 'interdis';
        //     }
        //     link_data_new.push(link_data[univ])
        // })
        // console.log(link_data_new)

        // let node_data = []
        // node_data.push({'id':activeUniv,'group':'self'})
        // link_data_new.forEach(d=>{
        //     node_data.push({'id':d.target,'group':d.major_area})
        // })
        // console.log(node_data)

        // this.colorMap = {'ai':'red','system':'blue','theory':'green','interdis':'yellow'}

        // const links = link_data_new
        // // .map(d => Object.create(d));
        // const nodes = node_data
        // // .map(d => Object.create(d));
        // const simulation = forceSimulation(nodes, links).on("tick", ticked);

        // const link = this.svg.append("g")
        //     .attr("transform","translate(200,200)")
        //     .attr("stroke", "#999")
        //     .attr("stroke-opacity", 0.6)
        //     .selectAll("line")
        //     .data(links)
        //     .enter().append("line")
        //     .attr("stroke-width", d => Math.sqrt(d.totalcoPub));
        
        // const node = this.svg.append("g")
        //     .attr("transform","translate(200,200)")
        //     .attr("stroke", "#fff")
        //     .attr("stroke-width", 1.5)
        //     .selectAll("circle")
        //     .data(nodes)
        //     .enter().append("circle")
        //     .attr("r", 5)
        //     .style("fill", d => this.colorMap[d.group])
        //     .call(drag(simulation));
        
        // node.append("title")
        //     .text(d => d.id)
        
        // function ticked() {
        //     link
        //         .attr("x1", d => d.source.x)
        //         .attr("y1", d => d.source.y)
        //         .attr("x2", d => d.target.x)
        //         .attr("y2", d => d.target.y);
        //     node
        //         .attr("cx", d => d.x)
        //         .attr("cy", d => d.y);
        //       }
        // function forceSimulation(nodes, links) {
        //     return d3.forceSimulation(nodes)
        //             .force("link", d3.forceLink(links).id(d => d.id))
        //             .force("charge", d3.forceManyBody())
        //             .force("center", d3.forceCenter());
        // }
        // function drag(simulation) {
  
        //     function dragstarted(d) {
        //       if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        //       d.fx = d.x;
        //       d.fy = d.y;
        //     }
            
        //     function dragged(d) {
        //       d.fx = d3.event.x;
        //       d.fy = d3.event.y;
        //     }
            
        //     function dragended(d) {
        //       if (!d3.event.active) simulation.alphaTarget(0);
        //       d.fx = null;
        //       d.fy = null;
        //     }
            
        //     return d3.drag()
        //         .on("start", dragstarted)
        //         .on("drag", dragged)
        //         .on("end", dragended);
        // }


    }
}