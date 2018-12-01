/** Class representing the information box. */

class InfoBox{
    constructor(collabDetails, inslist, updateUniv, updateYear) {
        this.collabDetails = collabDetails;
        this.inslist = inslist;
        this.infogroup = d3.select("#worldmap-svg").append("g")
            .attr("id","infobox")
            .attr("transform", "translate(-420, 0)");
        
        this.updateUniv = updateUniv
        this.updateYear = updateYear
        
        this.infoButton = d3.select("#infoBoxbutton")
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
        this.infoButton.transition().duration(350).style("left","250px");
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
            .attr("rx","15")
            .attr("width","300")
            .attr("height","780");
        framegroup.append("rect")
            .classed("boxframe", true)
            .attr("rx","15")
            .attr("width","300")
            .attr("height","780");
        let textgroup = this.infogroup.append("g")
            .attr("transform","translate(150,100)")
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
            .attr("id", "csrankingsSub")
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
        if(this.inslist.indexOf(activeUniv)!=-1){
            if(activeYear===undefined){activeYear = Object.keys(this.collabDetails)};
            this.infoButton.style("visibility", "initial");
            this.showButton();
            this.ifDisplay = true;
            let infoData = {'totalColl':0, 'totalcoPub':0, 'ai':0, 'system':0, 'theory':0, 'interdis':0};
            let univlist = []
            activeYear.forEach(year=>{
                if(Object.keys(this.collabDetails[year]).indexOf(activeUniv)!=-1){
                    Object.keys(this.collabDetails[year][activeUniv]).forEach(univ => {
                        if(univlist.indexOf(univ)===-1){
                            univlist.push(univ);
                            infoData.totalColl += 1;
                        }
                        let coll = this.collabDetails[year][activeUniv][univ];
                        infoData.ai += coll.ai;
                        infoData.system += coll.system;
                        infoData.theory += coll.theory;
                        infoData.interdis += coll.interdis;
                        infoData.totalcoPub += coll.total;
    
                    })
                }
            })

            // let numberofPubs = {'total':0, 'ai':0, 'system':0, 'theory':0, 'interdis':0}
            // for(let i=0;i<Object.keys(infoData).length;i++){
            //     numberofPubs.total += infoData[Object.keys(infoData)[i]].total;
            //     numberofPubs.ai += infoData[Object.keys(infoData)[i]].ai;
            //     numberofPubs.system += infoData[Object.keys(infoData)[i]].system;
            //     numberofPubs.theory += infoData[Object.keys(infoData)[i]].theory;
            //     numberofPubs.interdis += infoData[Object.keys(infoData)[i]].interdis;
            // }

            let pieData = [{"label":"Theory", "value":infoData.theory}, 
            {"label":"System", "value":infoData.system}, 
            {"label":"Interdisciplinary", "value":infoData.interdis},
            {"label":"AI", "value":infoData.ai}];
            let pieData1 = []
            for(let i=0;i<pieData.length;i++){
                if(pieData[i].value!=0){
                    pieData1.push(pieData[i])
                }
            }
            // console.log(pieData1)

            let pie = d3.pie()
                .sort(null)
                .value(d => d.value);
            
            let arcs = pie(pieData1);

            // let color = d3.scaleOrdinal()
            //     .domain(pieData1.map(d => d.label))
            //     .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), pieData1.length).reverse())

            let arc = d3.arc()
                .innerRadius(80)
                .outerRadius(110);
            let arc1 = d3.arc()
                .innerRadius(80)
                .outerRadius(120);

            d3.select("#piechartinfo")
                .text("Total: "+infoData.totalcoPub);

            let pies = d3.select("#univPieChart")
            .attr("transform","translate(160,450)")
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
                            .attr("class","pietext "+textclass)
                            .text(totext);
                        d3.select("#pie"+d.data.label)
                            .attr("d", arc1);
                    }
                })
                .on("mouseout", d=>{
                    d3.select("#pie"+d.data.label)
                        .attr("d", arc);
                    d3.select("#piechartinfo")
                        .attr("class","pietext")
                        .text("Total: "+infoData.totalcoPub);
                });


            d3.select("#univName")
                .attr("class","name")
                .text(activeUniv)
                .style("white-space","nowrap");

            let univ_copub = {};
            let activeUniv2rank = {};
            activeYear.forEach(year => {
                Object.keys(this.collabDetails[year]).forEach(univ1 => {
                    Object.keys(this.collabDetails[year][univ1]).forEach(univ2 => {
                        if(univ_copub[univ1]===undefined){univ_copub[univ1] = this.collabDetails[year][univ1][univ2];}
                        else{
                            ['ai','system','theory','total','interdis'].forEach(area => {
                                univ_copub[univ1][area] += this.collabDetails[year][univ1][univ2][area];
                            });
                        }
                    });
                });
            });
            let csrankingsSub = [];
            univ_copub = Object.keys(univ_copub).map(univ=>[univ,univ_copub[univ]]);
            ['ai','system','theory','total','interdis'].forEach(area => {
                univ_copub = univ_copub.sort((a,b)=>(b[1][area]-a[1][area]))
                for (let index = 0; index < univ_copub.length; index++) {
                    if(univ_copub[index][0]===activeUniv){
                        activeUniv2rank[area] = index+1;
                        if(area!='total'){csrankingsSub.push(area+'-'+(index+1));}
                    }

                }
            });
            csrankingsSub = csrankingsSub.join(' ')

            let yearPeriod = []
            yearPeriod.push(activeYear[0])
            yearPeriod.push(activeYear[activeYear.length-1])
            d3.select("#selectedPeriod")
                .attr("dy", 60)
                .text("Selected Period: "+yearPeriod[0]+"-"+yearPeriod[1]);
            d3.select("#csrankings")
                .attr("dy", 90)
                .text("CS Rankings: "+activeUniv2rank['total']);
            // d3.select("#csrankingsSub")
            //     .attr("dy", 120)
            //     .text('('+csrankingsSub+')');
            d3.select("#numberofColls")
                .attr("dy", 120)
                .text("Number of Collaborators: "+infoData.totalColl);
            d3.select("#numberofPubs")
                .attr("dy", 150)
                .text("Number of Co-published Papers: "+infoData.totalcoPub);
        }
    }
}