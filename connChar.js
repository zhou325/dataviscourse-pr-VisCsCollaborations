class connChar{


  constructor(data){
      //const map = new Map;

    //console.log(Object.keys(data));
    let key_set = Object.keys(data);
    this.data = [];

    let temp;
    let k_set;

    for (let s of key_set){
        let map_entry = {};
        temp = data[s];
        //console.log(temp);
        map_entry["key"] = s;
        map_entry["children"] = [];
        k_set = Object.keys(temp);
        for (let i of k_set)
        {
           map_entry["children"].push({"University" : i,  "Value": temp[i]});
        }
        this.data.push(map_entry);

    }
    console.log(this.data);
  }
    //console.log(this.data);
    create_chart(){
      let data = this.data;
      console.log(data[0]);
      let d = d3.hierarchy(data[0]);
      console.log(d.leaves());
      let root = [];
      //data.forEach(d => function(d){
         //root.push(d3.hierarchy(d));
      //});
      //console.log(root);

      let width = 932;
      let radius = 932/2;
      let tree = d3.cluster().size([2 * Math.PI, radius - 100])
      let line = d3.radialLine()
               .curve(d3.curveBundle.beta(0.85))
               .radius(d => d.y)
               .angle(d => d.x)



      let rt = tree(d3.hierarchy(data[0]))
      //let canvas = document.getElementById('connChar');

      console.log(rt.leaves());
      let width = 964
      let outerRadius = 482
      let innerRadius = 310

      d3.select("#connChar")
        .append("svg")
        .style("width", "100%")
        .style("height", "auto")
        .style("font", "10px sans-serif")
        .attr("viewBox", [-outerRadius, -outerRadius, width, width]);

   }












    }
