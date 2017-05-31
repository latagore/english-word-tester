let natural = require('natural'),
    metaphone = natural.Metaphone, soundEx = natural.SoundEx;
let words = require("an-array-of-english-words");
let Chain = require('../markov-chains/dist/markov-chains.js').default;

//const corpus = words.map((str) => soundEx.process(str).split(''));
const corpus = words.map((str) => str.split(''));
const chain = new Chain(corpus, {stateSize: 3});

let letters = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PRS', 'TUV', 'WXY'];
function findLikelyEnglishWords(number) {
  let results = [];

  for (let iteration = 0; iteration < 2187; iteration++) {
    let word = "";
    let counter = iteration;
    // calculate an index for the 8 keys
    for (let i = 0; i < 7; i++) {
      word += letters[number.charAt(i) - 2].charAt(counter % 3);
      counter = Math.floor(counter / 3);
    }
    
    let phoneme = soundEx.process(word);
    
    results.push([word, chain.likelihoodOf(word.toLowerCase().split(''))]);
    //results.push([word, chain.likelihoodOf(phoneme.split(''))]);
  }
  
  results.sort(function(a, b) {
    return b[1] - a[1];
  });
  
  console.log(`Phone number is: ${number}`);
  results.slice(0, 10).forEach(r => {
    console.log(`Word: "${r[0]}", Probability: ${r[1]}`);
  });
  console.log("=======");
  console.log();
}



//console.log(words.includes('brother'));
//console.log(soundEx.process('brother'));
//console.log(soundEx.process('mother'));
//console.log(soundEx.process('cloud'));
//console.log(soundEx.process('hello'));
//console.log(soundEx.process('significant'));
//console.log(soundEx.process('banana'));
//console.log(soundEx.process('pneumonia'));
//console.log(soundEx.process('hthchoc'))
findLikelyEnglishWords("2768437");
//findLikelyEnglishWords("4668956");
//findLikelyEnglishWords("2737437");
//findLikelyEnglishWords("3272365");

for (let i = 0; i < 20; i++) {
  let string = "";
  for (let j = 0; j < 7; j++) {
    string += Math.floor(Math.random()*7) + 2 + "";
  }
  
  console.log(`finding possible words for ${string}`);
  findLikelyEnglishWords(string);
}