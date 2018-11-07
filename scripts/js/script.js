console.log("i am here")

d3.json('dataProcessing/data/confArticles.json').then(articleData => {
    console.log(articleData);
});

d3.json('dataProcessing/data/collaborations.json').then(collData => {
    console.log(collData);
});

d3.json('dataProcessing/data/collaborationsDetails.json').then(collDeData => {
    console.log(collDeData);
});


