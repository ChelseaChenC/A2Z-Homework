const express = require('express');
const bodyParser = require('body-parser');
const { readFile, unlink } = require('fs');
const { getSubs } = require('youtube-dl');
const { promisify } = require('util');
const sw = require('stopword');

const readFileAsync = promisify(readFile);
const unlinkAsync = promisify(unlink);
const getSubsAsync = promisify(getSubs);

const regex = /(<([^>]+)>)/ig;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get('/api', async (req, res) => {
  const url = req.query.url;
  if (url === undefined) {
    res.jsonp('No subtitle founded.');
    return;
  }
  const options = {
    auto: true,
    all: false,
    lang: 'en',
    cwd: __dirname,
  };
  console.log(url);
  const [ file ] = await getSubsAsync(url, options);
  console.log(file);
  if (file) {
    const subtitle = await readFileAsync(file);
    const words = subtitle.toString()
                        .toLowerCase()
                        .split('\n\n')
                        .slice(1)
                        .map((x) => x.replace(regex, '')
                                    //  .toLowerCase()
                                     .split('\n')
                                     .slice(1)
                                     .join(' '))
                        .join(' ')
                        .split(' ')
                        .filter((x) => x);

    words = sw.removeStopwords(words, ["you", "gonna", "say", "let's", "just", "want", "look", "let", "go", "do", "not", "thing"]);
    const counts = words.reduce((counts, word) => {
      counts[word] = (counts[word] || 0) + 1;
      return counts;
    }, {});
    const rank = Object.entries(counts).sort(([, x], [, y]) => y - x);
    res.jsonp(rank);
    await unlinkAsync(file);
  } else {
    res.jsonp('No subtitle founded.');
  }
});

app.use(express.static('public'));
app.listen(5001, () => console.log('server started'));
