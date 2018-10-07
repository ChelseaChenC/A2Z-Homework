console.log("choooooo");

const config = require('./config.js');
const Mastodon = require("mastodon-api");
const clipboardy = require('clipboardy');
const fs = require("fs");
const M = new Mastodon(config);


// console.log(M);

// w = clipboardy.readSync();
//tooter();
// console.log(w);

setInterval(tooter, 240 * 5 * 1000);

function tooter() {
    w = clipboardy.readSync();
    const toot = {
        // statues: clipboardy.readSync()
        status: 'I just copied👩‍💻 : ' + w
    }
    console.log(toot.status);
    M.post('statuses', toot, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data.content);
        }
    });


}