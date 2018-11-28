/** Class representing the information box. */

class InfoBox{
     /**
     * Creates a Map Object
     *
     * @param world the full dataset
     * country was updated (clicked)
     */
    constructor(data, inslist, updateUniv) {
        // ******* TODO: PART I *******
        this.data = data;
        this.inslist = inslist;
        this.width = 500;
        this.height = 800;
        this.infogroup = d3.select("#worldmap-svg").append("g")
            .attr("id","infobox")
            .attr("transform", "translate(-420, 0)");
        
        this.updateUniv = updateUniv
        
        this.infoButton = d3.select("#infoBoxbutton")
        console.log(this.infoButton)
        this.ifDisplay = false;
        this.infoButton.on("click", function () {
            if (this.ifDisplay === false) {
                this.showButton();
                this.ifDisplay = true;
            }
            else {
                this.hideButton();
                this.ifDisplay = false;
            }
        }.bind(this));

    }
    hideButton() {
        this.infoButton.transition().duration(350).style("left","0px");
        this.infoButton.classed("fa-arrow-alt-circle-right",true).classed("fa-arrow-alt-circle-left",false);
        d3.select("#infobox")
            .transition().duration(350)
            .attr("transform", "translate(-420, 0)");
    }

    showButton() {
        this.infoButton.transition().duration(350).style("left","360px");
        this.infoButton.classed("fa-arrow-alt-circle-right",false).classed("fa-arrow-alt-circle-left",true);
        d3.select("#infobox")
            .transition().duration(350)
            .attr("transform", "translate(0, 0)")
    }

    drawInfoBox(){
        let framegroup = this.infogroup.append("g")
            .classed("frameGroup", true);
        framegroup.append("rect")
            .classed("backgroundframe",true)
            .attr("x","10")
            .attr("y","100")
            .attr("rx","15")
            .attr("width","400")
            .attr("height","600");
        framegroup.append("rect")
            .classed("boxframe", true)
            .attr("x","10")
            .attr("y","100")
            .attr("rx","15")
            .attr("width","400")
            .attr("height","600");
        let textgroup = this.infogroup.append("g")
            .attr("transform","translate(210,150)")
            .classed("textGroup", true);
        textgroup.append("text")
            .attr("id","univName")
            .attr("text-anchor", "middle");
        textgroup.append("text")
            .classed("textinfo",true)
            .attr("id", "selectedPeriod")
            .attr("text-anchor", "middle");
        textgroup.append("text")
            .classed("textinfo",true)
            .attr("id", "csrankings")
            .attr("text-anchor", "middle");
        textgroup.append("text")
            .classed("textinfo",true)
            .attr("id", "numberofColls")
            .attr("text-anchor", "middle");
        textgroup.append("text")
            .classed("textinfo",true)
            .attr("id", "numberofPubs")
            .attr("text-anchor", "middle");
        let piegroup = this.infogroup.append("g")
            .classed("pieChart",true)
            .attr("id","univPieChart");
        piegroup.append("text")
            .classed("pietext",true)
            .attr("id","piechartinfo")
            .attr("text-anchor", "middle");

    }

    updateInfoBox(activeUniv, activeYear){
        this.infoButton.style("visibility", "initial");
        this.showButton();
        this.ifDisplay = true;
        // this.infogroup
        //     .style("visibility","initial");

        if(this.inslist.indexOf(activeUniv)!=-1){
            let infoData = this.data[activeYear][activeUniv];
            console.log(infoData);

            let numberofPubs = {'total':0, 'ai':0, 'system':0, 'theory':0, 'interdis':0}
            for(let i=0;i<Object.keys(infoData).length;i++){
                numberofPubs.total += infoData[Object.keys(infoData)[i]].total;
                numberofPubs.ai += infoData[Object.keys(infoData)[i]].ai;
                numberofPubs.system += infoData[Object.keys(infoData)[i]].system;
                numberofPubs.theory += infoData[Object.keys(infoData)[i]].theory;
                numberofPubs.interdis += infoData[Object.keys(infoData)[i]].interdis;
            }

            let pieData = [{"label":"Theory", "value":numberofPubs.theory}, 
            {"label":"System", "value":numberofPubs.system}, 
            {"label":"Interdisciplinary", "value":numberofPubs.interdis},
            {"label":"AI", "value":numberofPubs.ai}];
            let pieData1 = []
            for(let i=0;i<pieData.length;i++){
                if(pieData[i].value!=0){
                    pieData1.push(pieData[i])
                }
            }
            console.log(pieData1)

            let pie = d3.pie()
                .sort(null)
                .value(d => d.value);
            
            let arcs = pie(pieData1);

            let color = d3.scaleOrdinal()
                .domain(pieData1.map(d => d.label))
                .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), pieData1.length).reverse())

            let arc = d3.arc()
                .innerRadius(120)
                .outerRadius(170);
            let arc1 = d3.arc()
                .innerRadius(120)
                .outerRadius(180);

            d3.select("#piechartinfo")
                .text("Total: "+numberofPubs.total);

            let pies = d3.select("#univPieChart")
            .attr("transform","translate(210,500)")
                .selectAll("path")
                .data(arcs);
            
            pies.exit().remove();
            let newpies = pies.enter().append("path");
            pies = newpies.merge(pies);
            pies
                .attr("id",d=>"pie"+d.data.label)
                // .attr("fill", d => color(d.data.label))
                .attr("class",d=>d.data.label)
                .attr("stroke", "white")
                .attr("d", arc)
                .attr("opacity",0.8)
                .on("mouseover", d=> {
                    if(d){
                        let totext = d.data.label+": "+d.data.value;
                        let textclass = d.data.label;
                        d3.select("#piechartinfo")
                            .attr("class","textinfo "+textclass)
                            .text(totext);
                        d3.select("#pie"+d.data.label)
                            .attr("d", arc1);
                    }
                })
                .on("mouseout", d=>{
                    d3.select("#pie"+d.data.label)
                        .attr("d", arc);
                    d3.select("#piechartinfo")
                        .attr("class","textinfo")
                        .text("Total: "+numberofPubs.total);
                })
            
            // let pieText = d3.select("#univPieChart")
            // .attr("transform","translate(200,500)")
            //     .selectAll("text")
            //     .data(arcs)
            //     .enter().append("text")
            //     .each(function(d) {
            //         let centroid = arc.centroid(d);
            //         d3.select(this)
            //             .attr('x', centroid[0]*1.4-50)
            //             .attr('y', centroid[1])
            //             .attr('dy', '0.03em')
            //             .text(d.data.label+": "+d.data.value);
            //     })

            d3.select("#univName")
                // .attr("dx", 60)
                // .attr("dy", 0)
                .attr("class","name")
                .text(activeUniv)
            d3.select("#selectedPeriod")
                // .attr("dx", 30)
                .attr("dy", 60)
                .text("Selected Period: "+activeYear)
            d3.select("#csrankings")
                // .attr("dx", 30)
                .attr("dy", 90)
                .text("CS Rankings: 1")
            d3.select("#numberofColls")
                // .attr("dx", 60)
                .attr("dy", 120)
                .text("Number of Collaborators: 30")
            d3.select("#numberofPubs")
                // .attr("dx", 60)
                .attr("dy", 150)
                .text("Number of Co-published Papers: "+numberofPubs.total)
            // let isShow = d3.select("#infoBox").classed("show");
            // if (!isShow) {
            //     this.showButton();
            //     $('#infoBoxbutton').trigger("click");
            // }

        }
    }
}