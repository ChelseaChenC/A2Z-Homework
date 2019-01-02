const loadJsonFile = require('load-json-file');
const elasticlunr = require('elasticlunr');
const fs = require('fs');

if (typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

loadJsonFile('./data/uexpressAbby.json').then(json => {
    const index = elasticlunr(function () {
        this.setRef('id'); 
        this.addField('date');
        this.addField('title');
        this.addField('question');
        this.addField('response');
    });

    let questionId = 0;
    for (const page of json) {
        const { alticles, date } = page;
        for (const alticle of alticles) {
            const { title, text } = alticle;
            const questionRegex = /(DEAR ([\w\W]*))\nDEAR/;
            const matchedGroups = text.match(questionRegex);
            if (matchedGroups && matchedGroups.length > 1) {
                const question = matchedGroups[1].trim();
                const response = text.replace(question, '').trim();
                questionId++;
                if (date < '1996') continue;
                index.addDoc({
                    id: questionId,
                    date,
                    title,
                    question,
                    response,
                });
            }
        }
    }

    fs.writeFile('./data/search_index.json', JSON.stringify(index), function (err) {
        if (err) throw err;
        console.log('done');
    });
});

       
