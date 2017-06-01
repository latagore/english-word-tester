console.log('loading markov chains library');
const englishWordsFinder = require('./englishWords.js');
const MarkovChainEnglishWordFinder = englishWordsFinder.MarkovChainEnglishWordFinder;
const Utils = englishWordsFinder.Utils;

console.log('loading natural language processing library');
let natural = require('natural'),
    metaphone = natural.Metaphone;

console.log('loading english words library');
let words = require('an-array-of-english-words');

let readline = require('readline');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// basic test case
console.log('creating markov chain');
let finder = new MarkovChainEnglishWordFinder([
  {corpus: words.map((str) => str.split('')), stateSize: 2}
]);
const testNumber = '2768437';
const testString = 'brother';
console.log(`finding possible words for ${testNumber} which matches ${testString}`);
Utils.printResults(finder.findLikelyEnglishWords(testNumber));

// random test cases
console.log('Press enter to try another number or Ctrl C to quit');
rl.on('line', function(line){
  let string = Utils.createRandomNumber();
  
  console.log(`finding possible words for ${string}`);
  let results = finder.findLikelyEnglishWords(string);
  Utils.printResults(results);
    
  console.log('Press enter to try another number or Ctrl C to quit');
});