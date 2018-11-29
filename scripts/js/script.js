async function worldMapLoadData() {
    // Load in GeoJSON and filliation data 
    let world = await d3.json("data/world.json");
    let world_aff = await d3.csv("data/world-affiliationsSub.csv");
    let pop = await d3.csv('data/pop.csv');
    let collabDetails = await d3.json('data/collaborationsDetails.json');
    let inslist = await d3.csv("data/insList.csv");

    return {
        'world':world,
        'world_aff':world_aff,
        'population': pop,
        'collabDetails': collabDetails,
        'inslist': inslist.map(d=>d.aff_name)
    };

};

// worldMap();

// d3.json('data/confArticles.json').then(articleData => {
//     console.log(articleData);
// });

d3.json('data/collaborations.json').then(collData => {
    d3.csv("data/world-affiliationsSub.csv").then(worldAff => {
        // console.log(Object.keys(collData));
        collNames = Object.keys(collData);
        // console.log(worldAff);
    }

    );
    
    // console.log(collData);
    // let chart = new connChar(collData);
    //chart.create_chart();
});

d3.json('data/collaborationsDetails.json').then(collDeData => {
    d3.csv("data/insList.csv").then(inslist =>{
        console.log(collDeData);
        
        
        let table = new comparsion(collDeData);
        table.create_comparsion();

        worldMapLoadData().then(data => {
            this.activeUniv = null;
            this.activeYear = '2015';
            let that = this
        
            function updateUniv(univName) {
                // that.activeUniv = univName;
        
                infoBox.updateInfoBox(univName, that.activeYear);
                worldMap.updateMap(univName, that.activeYear)
            }
        
            const worldMap = new Map(data.world,data.world_aff,data.population,data.collabDetails, updateUniv,table);
            worldMap.drawMap();
            worldMap.updateMap(undefined,undefined);
            
            const infoBox = new InfoBox(data.collabDetails, data.inslist, updateUniv);
            infoBox.drawInfoBox();
            // infoBox.updateInfoBox("Carnegie Mellon University",'2015');
        });


    });
    
});

