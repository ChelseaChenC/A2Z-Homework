const bodyParser = require('body-parser');
const elasticlunr = require('elasticlunr');
const express = require('express');
const loadJsonFile = require('load-json-file');

let searchIndex = null;

const searchConfig = {
   fields: {
      title: {boost: 3, bool: "AND"},
      question: {boost: 2, bool: "AND"},
      response: {boost: 2, bool: "OR"},
   },
   boolean: 'OR',
};

loadJsonFile('./data/search_index.json').then(json => {
   searchIndex = elasticlunr.Index.load(json);
});

const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile('public/index.html');
});

app.get('/api', (req, res) => {
   if (searchIndex === null) {
      res.jsonp('Serach index is not loaded yet.');
      return;
   }
   const { query } = req.query;
   const alticles = searchIndex
      .search(query, searchConfig)
      .map(({ ref, score }) => ({...searchIndex.documentStore.getDoc(ref), score }));
   res.jsonp(alticles);
});

app.listen(1225, function(){
   console.log('Server is fine!');
});
