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
            .attr("id","infobox");
        
        this.updateUniv = updateUniv
        
        // this.infoButton = d3.select("#infoBoxbutton")
        // this.infoButton.on("click", function () {
        //     let ifDisplay = d3.select("#infoBox").classed("show");
        //     if (ifDisplay === false) {
        //         this.showButton();
        //     }
        //     else {
        //         this.hideButton();
        //     }
        //     this.showButton();
        // }.bind(this));

    }
    hideButton() {
        this.infoButton.transition().duration(350).style("left","0px");
        this.infoButton.classed("fa-chevron-right",true).classed("fa-chevron-left",false);
    }

    showButton() {
        this.infoButton.transition().duration(350).style("left","400px");
        this.infoButton.classed("fa-chevron-right",false).classed("fa-chevron-left",true);
    }

    drawInfoBox(){
        let boxFrame = this.infogroup.append("g")
            .classed("textInfo", true);
        boxFrame.append("rect")
            .classed("backgroudframe",true)
            .attr("x","50")
            .attr("y","100")
            .attr("width","300")
            .attr("height","450")
            .attr("fill","white")
            .style("opacity",0.8)
        boxFrame.append("rect")
            .classed("boxframe", true)
            .attr("x","50")
            .attr("y","100")
            .attr("width","300")
            .attr("height","450");
        boxFrame.append("text")
            .attr("id","univName");
        boxFrame.append("text")
            .attr("id", "selectedPeriod")
        boxFrame.append("text")
            .attr("id", "csrankings");
        boxFrame.append("text")
            .attr("id", "numberofColls");
        boxFrame.append("text")
            .attr("id", "numberofPubs");
        boxFrame.append("g")
            .classed("pieChart",true)
            .attr("id","univPieChart");

    }

    updateInfoBox(activeUniv, activeYear){
        // this.infoButton.style("visibility", "initial");

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
            console.log(numberofPubs)

            let pieData = [{"label":"Theory", "value":numberofPubs.theory}, 
            {"label":"System", "value":numberofPubs.system}, 
            {"label":"Interdisciplinary", "value":numberofPubs.interdis},
            {"label":"AI", "value":numberofPubs.ai}];

            let pie = d3.pie()
                .sort(null)
                .value(d => d.value);
            
            let arcs = pie(pieData);

            let color = d3.scaleOrdinal()
                .domain(pieData.map(d => d.label))
                .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), pieData.length).reverse())

            let arc = d3.arc()
                .innerRadius(0)
                .outerRadius(100)

            d3.select("#univPieChart")
                .attr("transform","translate(10,200)")
                .selectAll("path")
                .data(arcs)
                .enter().append("path")
                    .attr("fill", d => color(d.data.label))
                    .attr("stroke", "white")
                    .attr("d", arc)
                    .attr("opacity",0.8);
            
            let pieText = d3.select("#univPieChart")
            .attr("transform","translate(180,400)")
                .selectAll("text")
                .data(arcs)
                .enter().append("text")
                .each(function(d) {
                    let centroid = arc.centroid(d);
                    d3.select(this)
                        .attr('x', centroid[0]*1.4-50)
                        .attr('y', centroid[1])
                        .attr('dy', '0.03em')
                        .text(d.data.label+": "+d.data.value);
                })

            d3.select("#univName")
                .attr("dx", 60)
                .attr("dy", 150)
                .attr("class","name")
                .text(activeUniv)
            d3.select("#selectedPeriod")
                .attr("dx", 60)
                .attr("dy", 180)
                .text("Selected Period: 2000-2018")
            d3.select("#csrankings")
                .attr("dx", 60)
                .attr("dy", 210)
                .text("CS Rankings: 1")
            d3.select("#numberofColls")
                .attr("dx", 60)
                .attr("dy", 240)
                .text("Number of Collaborators: 30")
            d3.select("#numberofPubs")
                .attr("dx", 60)
                .attr("dy", 270)
                .text("Number of Publications: "+numberofPubs.total)
            // let isShow = d3.select("#infoBox").classed("show");
            // if (!isShow) {
            //     this.showButton();
            //     $('#infoBoxbutton').trigger("click");
            // }

        }
    }
}