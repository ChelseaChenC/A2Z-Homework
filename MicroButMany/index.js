const loadJsonFile = require('load-json-file');

var decade1 = [];
var decade2 = [];
var decade3 = [];
// var topic = [];
let topicCounts = {};
 
loadJsonFile('public/data/uexpressAbby.json').then(json => {  
    for (const page of json) {
        const { date, alticles } = page;
        if (alticles.length === 0) {
            continue;
        }
        const year = parseInt(date.substring(0, 4)); 
        let pushTarget;
        if (year < 2000) {
            pushTarget=decade1;
        } else if (year < 2010) {
            pushTarget=decade2;
        } else {
            pushTarget=decade3;
        }
        pushTarget.push(page);

        for (const alticle of alticles) {
            const { topics } = alticle;
            topicCounts[year] = topicCounts[year] || {};
            counts = topicCounts[year];
            for (const topic of topics) {
                counts[topic] = (counts[topic] || 0) + 1;
            }
        }


    }
    console.log(decade1.length);
    console.log(decade2.length);
    console.log(decade3.length);
    console.log(topicCounts);
    /* 
    for(let i = 0; i < json.length; i++) {
        let year = parseInt(json[i].date.substring(0, 4));
        // console.log(json[1]);

        if (year < 2000 && json[i].alticles[0]!== undefined){
            decade1.push(json[i]);
        } else if (1999 < year && year <2010 && json[i].alticles[0]!== undefined) {
            decade2.push(json[i]);
        } else if (json[i].alticles[0]!== undefined) {
            decade3.push(json[i]);
        };

        for(let t=0; t<json[i].length; t++){
            for(let j = 0; j < json[i].alticles[t].topics.length; j++){
                if (json[i].alticles[t]){
                let topicItem = json[i].alticles[t].topics[j];
               
                const counts = topicItem.reduce((counts, word) => {
                    counts[word] = (counts[word] || 0) + 1;
                    return counts;
                    // console.log(counts);
                  }, {});
            }};

        }



        

        
      
        
        // adds an element to the array if it does not already exist using a comparer 
        // function
                

    };
    console.log(decade1.length);
        console.log(decade2.length);
        console.log(decade3.length);
    */

});


