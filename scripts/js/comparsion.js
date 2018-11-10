class comparsion{

     constructor(data){
        this.data = data;
        let top_c = new Set();

        this.tableHeaders = ["University", "AI", "System", "Theory", "Interdisciplinary Areas"];
        this.Ai = ["ACM","SIGAI","AAAI","IJCAI","CVF","CVPR","ECCV","ICCV"
                    ,"SIGKDD","IMLS","NIPS","ICML","KDD","ACL","EMNLP",
                  "NAACL","SIGIR","WWW"];
        this.System = ["SIGARCH","ASPLOS","ISCA","MICRO","HPCA","SIGCOMM","NSDI",
                       "SIGSAC","IEEE","USENIX","CCS","OAKLAND","USENIX SECURITY",
                     "NDSS","SIGMOD","VLDB","ICDE","PODS","DAC","ICCAD",
                     "EMSOFT","RTAS","RTSS","HPDC","ICS","SC","MOBICOM","MOBISYS"
                   ,"SENSYS","IMC","SIGMETRICS","OSDI","SOSP","EUROSYS","FAST",
                   "USENIX ATC","PLDI","POPL","ICFP","OOPSLA","FSE","ICSE","ASE"
                 ,"ISSTA"];
        this.Theory = ["FOCS","SODA","STOC","IEEE TCMF","ACM","SIGACT","IACR"
             ,"CRYPTO","EUROCRYPT","SIGLOG","CAV","LICS"]
        this.Interdisciplinary = ["ACM","SIGBIO","ISMB","RECOMB",
           "SIGGRAPH","SIGGRAPH ASIA","EC","WINE","SIGCHI","CHI",
         "UBICOMP","IMWUT","PERVASIVE","UIST","IEEE","RAS","ICRA",
       "IROS","RSS","VGTC","VIS","VR"]
        //console.log(university[0]);
        //console.log(data[university[0]]);
        //console.log(data[university[1]]);
        //console.log(university.length);
        //console.log(data[0]);
        //console.log(Object.keys(data[university[0]]));
        this.cell = {
          "width" : 70,
          "height" : 20,
          "buffer" : 15
        }

        this.bar = {
          "height": 20
        }
        //this.citationScale =
        this.AiScale = null;
        this.SystemScale = null;
        this.TheoryScale = null;
        this.InterScale = null;


      }
     create_comparsion(){
          //console.log(this.topc);
          let data = this.data;
          let university = Object.keys(data);
          let length = university.length;
          //console.log(data[university[0]]);
          let keyset;
          let candidate;
          let keyset_length;
          let conference_key;
          let conference_key_length;
          let cl;
          let data_used = new Array();

          //console.log(this.Ai.includes("CVPR"));
          for (let i = 0; i < length; ++i){
              //console.log(i);
              keyset = Object.keys(data[university[i]]);
              //console.log(keyset);
              keyset_length = keyset.length;
              //console.log(data[university[i]][keyset[0]]);
              let map_entry = {};
              map_entry["University"] = university[i];
              map_entry["AI"] = 0;
              map_entry["System"] = 0;
              map_entry["Theory"] = 0;
              map_entry["Interdisciplinary"] = 0;
              //console.log(map_entry);
              for (let k = 0; k < keyset_length; k++){
                candidate = data[university[i]];
                //console.log(candidate[keyset[k]]);
                conference_key_length = Object.keys(candidate[keyset[k]]).length;
                conference_key = Object.keys(candidate[keyset[k]]).slice(1,conference_key_length+1);
                cl = conference_key.length;
                //console.log(cl);
                for (let s = 0; s < cl; s++)
                {
                  //if conference_key[s].toUpper
                  //console.log(conference_key[s].toUpperCase());

                  if (this.Ai.includes(conference_key[s].toUpperCase())){
                      let num = candidate[keyset[k]][conference_key[s]];
                      //console.log(num);
                      map_entry["AI"] = map_entry["AI"] + num;
                      //continue;
                  }
                  if (this.System.includes(conference_key[s].toUpperCase())){
                      map_entry["System"] = map_entry["System"] + candidate[keyset[k]][conference_key[s]];
                      //continue;
                  }
                  if (this.Theory.includes(conference_key[s].toUpperCase())){
                      map_entry["Theory"] = map_entry["Theory"] + candidate[keyset[k]][conference_key[s]];
                      //continue;
                  }
                  if (this.Interdisciplinary.includes(conference_key[s].toUpperCase())){
                      map_entry["Interdisciplinary"] = map_entry["Interdisciplinary"] + candidate[keyset[k]][conference_key[s]];
                      //continue;
                  }

                }

              }
          //console.log(map_entry);
          data_used.push(map_entry);

          }
          //console.log(data_used);
          function mappingData(d){
              return [

                {
                  'vis' : 'text',
                  "value" : d.University,
                  "key": "University"
                },
                {
                  'vis' : 'bar',
                  "value": d.AI,
                  "key" : "AI"
                },
                {
                  'vis' : 'bar',
                  'value': d.System,
                  "key" : "System"

                },
                {
                  'vis' : 'bar',
                  'value' : d.Theory,
                  "key": "Theory"
                },
                {
                  'vis' : 'bar',
                  'value': d.Interdisciplinary,
                  "key" : "InterD"
                }
              ]
            }
           //console.log(data_used.slice(0,20));
           let cellWidth = 50, cellHeight = 20;
           let part_data = data_used.slice(0,20);
           console.log(part_data);
           let te = mappingData(data_used[0]);
           console.log(te);
           this.AiScale = d3.scaleLinear().domain([Math.min.apply(null,part_data.map(d => d.AI))
                ,Math.max.apply(null,part_data.map(d => d.AI))]).range([0,cellWidth]);

           this.SystemScale = d3.scaleLinear().domain([Math.min.apply(null,part_data.map(d => d.System))
                     ,Math.max.apply(null,part_data.map(d => d.System))]).range([0,cellWidth]);

           this.TheoryScale = d3.scaleLinear().domain([Math.min.apply(null,part_data.map(d => d.Theory))
                               ,Math.max.apply(null,part_data.map(d => d.Theory))]).range([0,cellWidth]);

           this.InterScale = d3.scaleLinear().domain([Math.min.apply(null,part_data.map(d => d.Interdisciplinary))
                                      ,Math.max.apply(null,part_data.map(d => d.Interdisciplinary))]).range([0,cellWidth]);




           let tr = d3.select("tbody").selectAll("tr").data(data_used.slice(0,20));
           //tr.exit().remove();
           //let te = mappingData(data_used[0]);
           //console.log(te);
           tr = tr.enter().append("tr");
           let td = tr.selectAll("td").data((d) => mappingData(d));
           console.log(td);
           //td.exit().remove();
          let tdEnter = td.enter().append("td");
          td = tdEnter.merge(td);
          console.log(td);
          //let cellWidth = 50, cellHeight = 20;
          td = td.attr('width',cellWidth)
                 .attr('height',cellHeight);
          // td.select('svg').remove();
           let td_bars_ai = td.filter((d) => {
             return (d['vis'] == 'bar') && (d.key === "AI" )

           }
         );
          console.log(td_bars_ai);
           let td_svg_ai = td_bars_ai.append('svg')
                               .attr('width',cellWidth)
                               .attr('height',cellHeight);
           console.log(td_svg_ai);
            td_svg_ai.append('rect')
                     .attr('width',d => (this.AiScale(d["value"]) + 0.5))
                     .attr('height',cellHeight)
                     .attr('fill',"#af161e");


            let td_text_uni = td.filter((d) => {

                return (d['vis'] == 'text') && (d.key === "University")
            });

            let td_text_svg = td_text_uni.append('svg')
                                    .attr('width',cellWidth*5)
                                    .attr('height',cellHeight);

            td_text_svg.append('text')
                       .attr('x',cellWidth/2 - 10)
                       .attr('y',cellHeight/2)
                       .attr('fill',"#af161e")
                       .text(d => d.value);


             let td_bars_system = td.filter((d) => {
                  return (d['vis'] == 'bar') && (d.key === "System" )

                  }
              );
                //console.log(td_bars_ai);
              let td_svg_system = td_bars_system.append('svg')
                                           .attr('width',cellWidth)
                                           .attr('height',cellHeight);
                //console.log(td_svg_ai);
              td_svg_system.append('rect')
                           .attr('width',d => (this.SystemScale(d["value"])+0.5))
                           .attr('height',cellHeight)
                           .attr('fill',"green");



              let td_bars_theory = td.filter((d) => {
                        return (d['vis'] == 'bar') && (d.key === "Theory" )
                      }
              );
                              //console.log(td_bars_ai);
              let td_svg_theory = td_bars_theory.append('svg')
                                                .attr('width',cellWidth)
                                                .attr('height',cellHeight);
                              //console.log(td_svg_ai);
              td_svg_theory.append('rect')
                           .attr('width',d => (this.TheoryScale(d["value"])+0.5))
                           .attr('height',cellHeight)
                           .attr('fill',"blue");



              let td_bars_Inter = td.filter((d) => {
                                     return (d['vis'] == 'bar') && (d.key === "InterD" )
                                         }
                  );
                                           //console.log(td_bars_ai);
              let td_svg_Inter = td_bars_Inter.append('svg')
                                              .attr('width',cellWidth)
                                              .attr('height',cellHeight);
                                           //console.log(td_svg_ai);
              td_svg_Inter.append('rect')
                           .attr('width',d => (this.InterScale(d["value"])+0.5))
                           .attr('height',cellHeight)
                           .attr('fill',"orange");



     }
}
