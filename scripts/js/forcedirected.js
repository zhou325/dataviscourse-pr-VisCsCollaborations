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
        let linkgroup = this.svg.append("g")
            .attr("id","lllinkgroup")
            .attr("transform","translate(300,300), scale(1.5)")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            

        let nodegroup = this.svg.append("g")
            .attr("id","nodegroup")
            .attr("transform","translate(300,300), scale(1.5)")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)

    }
    updateGraph(activeunivList, activeYear){
        console.log(activeunivList, activeYear)
        if(activeunivList){
            if(activeYear===undefined){activeYear = Object.keys(this.collabDetails)};
            let univ_data = {};
            activeunivList.forEach(univ=>{
                univ_data[univ] = {'ai':0, 'system':0, 'theory':0, 'interdis':0, 'total':0, 'major_area':undefined};
                activeYear.forEach(year=>{
                    if(Object.keys(this.collabDetails[year]).indexOf(univ)!=-1){
                        Object.keys(this.collabDetails[year][univ]).forEach(univ2=>{
                            let coll = this.collabDetails[year][univ][univ2];
                            univ_data[univ].ai+=coll.ai;
                            univ_data[univ].system += coll.system;
                            univ_data[univ].theory += coll.theory;
                            univ_data[univ].interdis += coll.interdis;
                            univ_data[univ].total += coll.total;

                            univ_data[univ].major_area = 'ai';
                            if(univ_data[univ].system > univ_data[univ].ai){
                                univ_data[univ].major_area = 'system';
                            }
                            if(univ_data[univ].theory > univ_data[univ].system){
                                univ_data[univ].major_area = 'theory'
                            }
                            if(univ_data[univ].interdis > univ_data[univ].theory){
                                univ_data[univ].major_area = 'interdis'
                            }
                        })
                    }
                })
            })
            let nodes = [];
            Object.keys(univ_data).forEach(univ=>{
                nodes.push({'id': univ, 'group': univ_data[univ].major_area, 'total': univ_data[univ].total})
            })

            let link_data = {};
            let used_univ = [];
            for(let i=0;i<activeunivList.length;i++){
                let univ = activeunivList[i];
                used_univ.push(univ)
                link_data[univ] = {};
                used_univ.push(univ);
                activeYear.forEach(year=>{
                    if(Object.keys(this.collabDetails[year]).indexOf(univ)!=-1){
                        Object.keys(this.collabDetails[year][univ]).forEach(univ1=>{
                            if(activeunivList.indexOf(univ1)!=-1){
                                if(used_univ.indexOf(univ1)===-1){
                                    let coll = this.collabDetails[year][univ][univ1]
                                    if(Object.keys(link_data[univ]).indexOf(univ1)===-1){
                                        console.log(univ)
                                        link_data[univ][univ1] = {'source':univ,'target':univ1,'totalcoPub':0};
                                    }
                                    link_data[univ][univ1].totalcoPub += coll.total
                                }
                                
                            }
                        })
                    }
                    
                })
            }
            console.log(link_data)
            let links = [];
            Object.keys(link_data).forEach(univ=>{
                Object.keys(link_data[univ]).forEach(univ1=>{
                    links.push(link_data[univ][univ1])
                })
            })

            

            console.log("links",links)
            console.log("nodes",nodes)

            // this.colorMap = {'ai':'red','system':'blue','theory':'green','interdis':'yellow'};

            

            this.rScale = d3.scaleLinear()
                .domain([d3.min(nodes.map(d=>d.total)), d3.max(nodes.map(d=>d.total))])
                .range([5,15]);
            this.wScale = d3.scaleLinear()
                .domain([d3.min(links.map(d=>d.totalcoPub)), d3.max(links.map(d=>d.totalcoPub))])
                .range([1,10]);

            const simulation = forceSimulation(nodes, links).on("tick", ticked);

            let linkgraph = d3.select("#lllinkgroup").selectAll("line")
                .data(links);
            linkgraph.exit().remove();
            let newlinkgraph = linkgraph.enter().append("line");
            linkgraph = newlinkgraph.merge(linkgraph);
            linkgraph
                .attr("stroke-width", d => this.wScale(Math.sqrt(d.totalcoPub)));

            let nodegraph = d3.select("#nodegroup").selectAll("circle")
                .data(nodes);
            nodegraph.exit().remove();
            let newnodegraph = nodegraph.enter().append("circle");
            nodegraph = newnodegraph.merge(nodegraph)
            nodegraph
                .attr("r", d=>this.rScale(d.total))
                .attr("class", d=>"node"+d.group)
                // .style("fill", d => this.colorMap[d.group])
                .call(drag(simulation));
        
            nodegraph.append("title")
                .text(d => d.id);
            
            function ticked() {
                linkgraph
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
                nodegraph
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
              }
            function forceSimulation(nodes, links) {
                return d3.forceSimulation(nodes)
                        .force("link", d3.forceLink(links).id(d => d.id))
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter());
            }
            function drag(simulation) {
    
                function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                }
                
                function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
                }
                
                function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                }
                
                return d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended);
            }
            
        }
    }
}