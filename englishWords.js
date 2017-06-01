let natural = require('natural'),
    metaphone = natural.Metaphone, soundEx = natural.SoundEx;
console.log("loading english words");
let words = require("an-array-of-english-words");
let Chain = require('../markov-chains/dist/markov-chains.js').default;
let readline = require('readline');
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


class MarkovChainEnglishWordFinder {
  constructor(corpus, wordTransform) {
    // don't apply any transforms if wordtr
    this.wordTransform = wordTransform;
    this.chain = new Chain(corpus, {stateSize: 3});
  }
  
  findLikelyEnglishWords(number, numberOfResults = 10) {
    let results = Utils.generateNumberWords(number).map(word => {
      let transformedWord = word;
      if (typeof wordTransform === 'function') {
        transformedWord = wordTransform(word);
      }
      return [
        transformedWord,
        this.chain.likelihoodOf(word.split(''))
      ];
    });
    // sort probabilities numerically
    results.sort(function(a, b) {
      return b[1] - a[1];
    });
    
    // return top `numberOfResults` results
    return results.slice(0, numberOfResults);
  }
}

const PROBABILITY_PRECISION = 3;
const letters = ['abc', 'def', 'ghi', 'jkl', 'mno', 'prs', 'tuv', 'wxy']
  .map(x => x.split('')); // create an array of arrays of characters
const DIGITS_PER_NUMBER = 3;
class Utils {
  static printResults(results) {
    results.forEach(r => {
      console.log(`Word: "${r[0]}", Probability: ${r[1].toExponential(PROBABILITY_PRECISION)}`);
    });
    console.log("=======");
    console.log();
  }
  
  static generateNumberWords(number) {
    number = number + "";
    if (!number.match(/[2-9]+/)) {
      throw new Error(`Invalid number: ${number} must be a number with only digits between 2 and 9.`);
    }
    
    let results = [];
    for (let iteration = 0; iteration < Math.pow(DIGITS_PER_NUMBER, number.length); iteration++) {
      let word = "";
      let counter = iteration;
      // generate a word based on the counter
      for (let i = 0; i < 7; i++) {
        word += Utils.getPossibleLettersForDigit(number.charAt(i))[counter % 3];
        counter = Math.floor(counter / 3);
      }

      results.push(word.toLowerCase());
    }
    return results;
  }
  
  static getPossibleLettersForDigit(digit) {
    return letters[digit - 2];
  }
  
  static createRandomNumber() {
    let string = "";
    for (let j = 0; j < 7; j++) {
      string += Math.floor(Math.random()*7) + 2 + "";
    }
    return string;
  }
}

// basic test case
console.log("creating markov chain");
let finder = new MarkovChainEnglishWordFinder(words.map((str) => str.split('')));
Utils.printResults(finder.findLikelyEnglishWords("2768437"));

// random test cases
console.log('Press enter to try another number or Ctrl C to quit');
rl.on('line', function(line){
  let string = Utils.createRandomNumber();
  
  console.log(`finding possible words for ${string}`);
  let results = finder.findLikelyEnglishWords(string);
  Utils.printResults(results);
    
  console.log('Press enter to try another number or Ctrl C to quit');
});