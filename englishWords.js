let natural = require('natural'),
    metaphone = natural.Metaphone, soundEx = natural.SoundEx;
let words = require('an-array-of-english-words');
let Chain = require('./lib/markov-chains.js').default;

class MarkovChainEnglishWordFinder {
  /**
   * Creates a new finder using a Markov chain built with the `corpus`.
   *
   * @param {Array} corpus an array of arrays of data
   * @param {function} wordTransform how to transform possible words to match the corpus
   * @param {number} stateSize the size of states to build the Markov chain
   */
  constructor(corpus, wordTransform, stateSize = 2) {
    this.wordTransform = wordTransform;
    this.chain = new Chain(corpus, {stateSize});
  }
  
  
  /** 
   * Returns the most likely words that look like the `corpus`.
   * 
   * @param {string} number number
   */
  findLikelyEnglishWords(number, numberOfResults = 10) {
    let results = Utils.generateNumberWords(number).map(word => {
      let transformedWord = word;
      if (typeof wordTransform === 'function') {
        transformedWord = wordTransform(word);
      }

      return [
        word,
        this.chain.likelihoodOf(
          transformedWord.split(''),
          { includeBeginState: true, includeEndState: true }
        )
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

class MarkovChainSyllablesEnglishWordFinder {
  constructor(corpus, syllableCorpus, { lettersStateSize = 2, syllablesStateSize = 1} = { lettersStateSize: 2, syllablesStateSize: 1}) {
    this.wordChain = new Chain(corpus, {lettersStateSize});
    this.syllableChain = new Chain(syllableCorpus, {syllablesStateSize});
  }
  
  findLikelyEnglishWords(number, numberOfResults = 10) {
    let numberWords = Utils.generateNumberWords(number);
    let letterResults = numberWords.map(word => {
      return [
        word,
        this.wordChain.likelihoodOf(
          word.split(''),
          { includeBeginState: true, includeEndState: true }
        )
      ];
    });
    
    let syllableResults = numberWords.map(word => {
      return [
        word,
        this.syllableChain.likelihoodOf(
          metaphone.process(word).split(''),
          { includeBeginState: true, includeEndState: true }
        )
      ];
    });
    
    let results = letterResults.map (([word, letterProbability], i) => {
      let syllableProbability = syllableResults[i][1];
      return [word, letterProbability * syllableProbability];
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
    console.log('=======');
    console.log();
  }
  
  static generateNumberWords(number) {
    number = number + '';
    if (!number.match(/[2-9]+/)) {
      throw new Error(`Invalid number: ${number} must be a number with only digits between 2 and 9.`);
    }
    
    let results = [];
    for (let iteration = 0; iteration < Math.pow(DIGITS_PER_NUMBER, number.length); iteration++) {
      let word = '';
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
    let string = '';
    for (let j = 0; j < 7; j++) {
      string += Math.floor(Math.random()*7) + 2 + '';
    }
    return string;
  }
}


module.exports = {
  MarkovChainEnglishWordFinder,
  MarkovChainSyllablesEnglishWordFinder,
  Utils
};