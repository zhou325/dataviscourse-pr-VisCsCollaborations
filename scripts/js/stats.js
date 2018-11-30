class Stats{
    constructor(collabDetails, inslist){
        this.collabDetails = collabDetails;
        this.inslist = inslist;

        this.height = 400;
        this.width = 600;
        this.margin = 20;

        this.yearline_div = d3.select("#yearline").append("div")
        this.yearline_svg = this.yearline_div.append("svg")
            .attr("height", this.height)
            .attr("width", this.width)
            .attr("id","yearline_svg");
        this.yearlegend_div = d3.select("#yearline").append("div")
        this.yearlegend_svg = this.yearlegend_div.append("svg")
            .attr("height", 100)
            .attr("width", this.width)
            .attr("id","yearlegend_svg");

    }
    drawStats(){
        let xAxisGroup = d3.select('#yearline_svg').append("g").classed("x-axis", true);
        let yAaxisGroup = d3.select('#yearline_svg').append("g").classed("y-axis", true);
        let xAxisLabel = d3.select('#yearline_svg').append("g").classed("x-axis-label",true)
            .append("text");
        let yAxisLabel = d3.select('#yearline_svg').append("g").classed("y-axis-label",true)
            .append("text");
        
        let gridGroup = d3.select('#yearline_svg').append('g').classed('gridGroup',true);

        let line1 = d3.select("#yearline_svg").append("g")
            .attr("id","yearlineGroup");
    }
    updateStats(activeunivList, activeYear){
        if(!activeunivList){
            activeunivList = this.inslist;
        }
        if(!activeYear){
            activeYear = Object.keys(this.collabDetails);
        }
        let univinfo = {};
        activeYear.forEach(year=>{
            univinfo[year]={};
            activeunivList.forEach(univ=>{
                univinfo[year][univ] = {'totalcoll':0, 'ai':0, 'system':0,'theory':0, 'interdis':0, 'totalcoPub':0}
                let collList = [];
                if(Object.keys(this.collabDetails[year]).indexOf(univ)!=-1){
                    Object.keys(this.collabDetails[year][univ]).forEach(univ1=>{
                        if(collList.indexOf(univ1)===-1){
                            collList.push(univ1);
                            univinfo[year][univ].totalcoll += 1;
                        }
                        let coll = this.collabDetails[year][univ][univ1];
                        univinfo[year][univ].ai += coll.ai
                        univinfo[year][univ].system += coll.system
                        univinfo[year][univ].theory += coll.theory
                        univinfo[year][univ].interdis += coll.interdis
                        univinfo[year][univ].totalcoPub += coll.total
                    })
                }
            })
        })
 
        console.log(univinfo)

        let aveRage = [];
        activeYear.forEach(year=>{
            let total_stat = {'totalcoll':0, 'ai':0, 'system':0,'theory':0, 'interdis':0, 'totalcoPub':0}
            Object.keys(univinfo[year]).forEach(univ=>{
                total_stat.totalcoll += univinfo[year][univ].totalcoll;
                total_stat.ai += univinfo[year][univ].ai;
                total_stat.system += univinfo[year][univ].system;
                total_stat.theory += univinfo[year][univ].theory;
                total_stat.interdis += univinfo[year][univ].interdis;
                total_stat.totalcoPub += univinfo[year][univ].totalcoPub;
            })
            let average_stat = {};
            Object.keys(total_stat).forEach(s=>{
                average_stat[s] = total_stat[s]/activeunivList.length
            })
            aveRage.push({'year':year,'stat':average_stat})
        })
        console.log(aveRage)
        let maxpub = 0;
        let maxcoll = 0;
        aveRage.forEach(s=>{
            if(s.stat.totalcoPub > maxpub){
                
                maxpub = s.stat.totalcoPub;
            }
            if(s.stat.totalcoll > maxcoll){
                maxcoll = s.stat.totalcoll;
            }
        })
        
        let xScale = d3.scaleLinear()
            .domain([1980,2018])
            .range([25, this.width-20]);
        let yScale = d3.scaleLinear()
            .domain([Math.ceil(maxpub),0])
            .range([20, this.height-40]);

        let xAxis = d3.select("#yearline_svg").select('.x-axis')
            .call(d3.axisBottom(xScale))
            .attr("transform", "translate(0," + (this.height-40) + ")")
        let yAxis = d3.select("#yearline_svg").select('.y-axis')
            .call(d3.axisLeft(yScale))
            .attr("transform", "translate(" + 25 + ",0)")
        
        let xAxisLabel = d3.select("#yearline_svg").select(".x-axis-label").selectAll("text").text("Year")
            // .attr("class","axis-label")
            .attr('transform', 'translate(' + (this.width/2) + ', ' + (this.height-10) + ')')
            .style("font-size", "10px")
        let yAxisLabel = d3.select("#yearline_svg").select(".y-axis-label").selectAll("text").text("Average Co-Pubs")
            // .attr("class","axis-label")
            .attr('transform', 'translate(' + 10 + ', ' + 10 + ')')
            .style("font-size", "10px")
        
        let copubGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.stat.totalcoPub));
        copubGenerator = copubGenerator(aveRage);

        let aiGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.stat.ai));
        aiGenerator = aiGenerator(aveRage);

        let systemGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.stat.system));
        systemGenerator = systemGenerator(aveRage);

        let theoryGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.stat.theory));
        theoryGenerator = theoryGenerator(aveRage);

        let interdisGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.stat.interdis));
        interdisGenerator = interdisGenerator(aveRage);

        let generator = [{name: "AveCopub", value: copubGenerator}, {name: "AveAi", value: aiGenerator},{name: "AveSystem", value: systemGenerator},{name: "AveTheory", value: theoryGenerator},{name: "AveInterdis", value: interdisGenerator}];

        //draw line
        let copubPath = d3.select("#yearlineGroup").selectAll("path")
            .data(generator);
        copubPath.exit().remove();
        copubPath = copubPath.enter().append("path").merge(copubPath)
            .attr("fill", "none")
            .attr("class", d => d.name)
            .transition()
            .duration(1000)
            .attr("d", d => d.value);
        
        
        
        // function make_y_gridlines() {		
        //     return d3.axisLeft(xScale)
        //             .ticks(5)
        // }
        // d3.select("#yearline_svg").select('.gridGroup')
        //     .attr("transform","translate(20,-10)")
        //     .call(make_y_gridlines()
        //     .tickSize(-this.height)
        //     .tickFormat("")
    // )
    
        let colorScale = d3.scaleOrdinal()
            .domain(["AveCopub", "AveAi","AveSystem","AveTheory","AveInterdis"])
            .range(["black", "red","blue","green","tomato"]);
        let legendOrdinal = d3.legendColor()
            .orient("horizontal")
            .shape("path", d3.symbol().type(d3.symbolSquare).size(80)())
            .shapePadding(130)
            .scale(colorScale);
        
        d3.select("#yearlegend_svg").call(legendOrdinal)

    }
}