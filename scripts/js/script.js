console.log("i am here")

d3.json('dataProcessing/data/data.json').then(articleData => {
    console.log(articleData);
    // for(let i=0; i<articleData.length;i++){
    //     if(Object.keys(papers).indexOf(articleData[i].title)){
    //         papers[articleData[i].title] = [articleData[i].name];
    //     } else {
    //         papers[articleData[i].title].push(articleData[i].name);
    //     }
    // }
    // console.log(papers);
});


