/** Class representing the information box. */

class InfoBox{
     /**
     * Creates a Map Object
     *
     * @param world the full dataset
     * country was updated (clicked)
     */
    constructor(data) {
        // ******* TODO: PART I *******
        this.data = data;
        this.nameArray = Object.keys(data);
        this.width = 2000;
        this.height = 2000;
        this.svg = d3.select("#infoBox")
            .append("svg")
            .attr("height", this.height)
            .attr("width", this.width);

    }

    drawInfoBox(){
        let boxFrame = this.svg.append("g")
            .classed("textInfo", true);
        boxFrame.append("rect")
            .classed("boxframe", true)
            .attr("x","50")
            .attr("y","50")
            .attr("width","500")
            .attr("height","650");
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

    updateInfoBox(activeUniv){
        if(this.nameArray.indexOf(activeUniv)!=-1){
            let infoData = this.data[activeUniv];
            console.log(infoData);

            let totalPub = 0;
            for(let i=0;i<Object.keys(infoData).length;i++){
                totalPub += infoData[Object.keys(infoData)[i]].total;
            }

            let pieData = [{"label":"Theory", "value":378}, 
            {"label":"System", "value":509}, 
            {"label":"Interdisciplinary", "value":764},
            {"label":"AI", "value":692}];

            let pie = d3.pie()
                .sort(null)
                .value(d => d.value);
            
            let arcs = pie(pieData);

            let color = d3.scaleOrdinal()
                .domain(pieData.map(d => d.label))
                .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), pieData.length).reverse())

            let arc = d3.arc()
                .innerRadius(0)
                .outerRadius(200)

            d3.select("#univPieChart")
                .attr("transform","translate(250,450)")
                .selectAll("path")
                .data(arcs)
                .enter().append("path")
                    .attr("fill", d => color(d.data.label))
                    .attr("stroke", "white")
                    .attr("d", arc)
                    .attr("opacity",0.8);
            
            let pieText = d3.select("#univPieChart")
            .attr("transform","translate(300,450)")
                .selectAll("text")
                .data(arcs)
                .enter().append("text")
                .each(function(d) {
                    let centroid = arc.centroid(d);
                    d3.select(this)
                        .attr('x', centroid[0]*1.4-50)
                        .attr('y', centroid[1])
                        .attr('dy', '0.33em')
                        .text(d.data.label+": "+d.data.value);
                })

            d3.select("#univName")
                .attr("dx", 80)
                .attr("dy", 100)
                .attr("class","name")
                .text("Institute Name: "+activeUniv)
            d3.select("#selectedPeriod")
                .attr("dx", 80)
                .attr("dy", 130)
                .text("Selected Period: 2000-2018")
            d3.select("#csrankings")
                .attr("dx", 80)
                .attr("dy", 160)
                .text("CS Rankings: 1")
            d3.select("#numberofColls")
                .attr("dx", 80)
                .attr("dy", 190)
                .text("Number of Collaborators: 30")
            d3.select("#numberofPubs")
                .attr("dx", 80)
                .attr("dy", 220)
                .text("Number of Publications: "+totalPub)

        }
    }
}