let words = require("an-array-of-english-words");
words = words.filter(function(w) { return w.length <= 7 });


let letters = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PRS', 'TUV', 'WXY'];

function findLikelyEnglishWords(number) {
  for (let iteration = 0; iteration < 2187; iteration++) {
    let word = "";
    let counter = iteration;
    // calculate an index for the 8 keys
    for (let i = 0; i < 7; i++) {
      word += letters[number.charAt(i) - 2].charAt(counter % 3);
      counter = Math.floor(counter / 3);
    }
    
    //console.log(word);
    if (words.includes(word.toLowerCase())) {
      console.log(word);
    }
  }
}

console.log(words.includes('brother'));
findLikelyEnglishWords("2768437");