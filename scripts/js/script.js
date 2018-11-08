console.log("i am here")

d3.json('data/confArticles.json').then(articleData => {
    console.log(articleData);
});

d3.json('data/collaborations.json').then(collData => {
    console.log(collData);
});

d3.json('data/collaborationsDetails.json').then(collDeData => {
    console.log(collDeData);
});


