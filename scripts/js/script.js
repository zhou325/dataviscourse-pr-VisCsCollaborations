worldMapLoadData().then(data => {
    const worldMap = new Map(data.world,data.world_aff);
    worldMap.drawMap();
});


async function worldMapLoadData() {
    // Load in GeoJSON and filliation data 
    let world = await d3.json("data/world.json");
    let world_aff = await d3.csv("data/world-affiliations.csv");

    return {
        'world':world,
        'world_aff':world_aff
    };

};

// worldMap();

// d3.json('data/confArticles.json').then(articleData => {
//     console.log(articleData);
// });

d3.json('data/collaborations.json').then(collData => {
    console.log(collData);
    let chart = new connChar(collData);
    //chart.create_chart();
});

d3.json('data/collaborationsDetails.json').then(collDeData => {
    console.log(collDeData);
    const infoBox = new InfoBox(collDeData);
    infoBox.drawInfoBox();
    infoBox.updateInfoBox("Carnegie Mellon University");
    let table = new comparsion(collDeData);
    table.create_comparsion();
});


