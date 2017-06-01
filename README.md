# English word tester
This project solves the following programming challenge:

>Each number on the telephone dial (except 0 and 1) corresponds to three alphabetic characters. Those correspondences are:
>2 ABC  
>3 DEF  
>4 GHI  
>5 JKL 
>6 MNO 
>7 PRS 
>8 TUV 
>9 WXY
>
>Given a seven digit telephone number, calculate all 2187 possible "words" that number spells. Since the digits 0 and 1 have no alphabetic equivalent, an input number which contains those digits should be rejected.   Then, use your own heuristic to calculate the ones that are more likely to "sound" like english words and display only the top 10.

# Testing
Steps to run:
- run `npm install`
- try `node lettersAndSyllablesTest.js` to manually test the word finder that uses a Markov chain for the letters and another for Metaphone syllables.
- try `node lettersTest.js` to manually test the word finder that uses a Markov chain on the letters.

# Design
`MarkovChainEnglishWordFinder` is the meat of the application. In the tests, an body of common english words is imported from the `an-array-of-english-words` npm package and used to train a Markov chain. 

`lettersAndSyllablesTest.js` also constructs a Markov chain using words converted into syllables using the Metaphone algorithm from the `natural` npm package. It combines the probabilities with the one used from the 