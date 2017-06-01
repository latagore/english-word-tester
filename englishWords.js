let Chain = require('./lib/markov-chains.js').default;

class MarkovChainEnglishWordFinder {
  /**
   * Creates a new finder using a Markov chain built with the `corpus`.
   *
   * @param {Array} corpus an array of arrays of data
   * @param {function} wordTransform how to transform possible words to match the corpus
   * @param {number} stateSize the size of states to build the Markov chain
   */
  constructor(array) {
    // TODO assert arrray is an array
    // assert that the array is at least length 1
    this.chains = [];
    for (const {corpus, stateSize = 1, wordTransform} of array) {
      // assert it has corpus
      const chain = new Chain(corpus, stateSize);
      chain.wordTransform = wordTransform;
      this.chains.push(chain);
    }
  }
  
  
  /** 
   * Returns the most likely words that look like the `corpus`.
   * 
   * @param {string} number number
   */
  findLikelyEnglishWords(number, numberOfResults = 10) {
    let numberWords = Utils.generateNumberWords(number);
    
    let chainResults = [];
    for (const chain of this.chains) {
      let cResults = numberWords.map(word => {
        let transformedWord = word;
        if (typeof chain.wordTransform === 'function') {
          transformedWord = chain.wordTransform(word);
        }

        return [
          word,
          chain.likelihoodOf(
            transformedWord.split(''),
            { includeBeginState: true, includeEndState: true }
          )
        ];
      });
      
      chainResults.push(cResults);
    }
    
    // combine probabilities from each chain
    let results = chainResults.slice(1).reduce((results, cResults) => {
      return results.map(([word, probability], i) => {
        return [word, probability * cResults[i][1]];
      });
    }, chainResults[0]);
    
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
  Utils
};