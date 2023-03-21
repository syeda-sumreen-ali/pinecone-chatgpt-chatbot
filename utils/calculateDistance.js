/**
 * 
 * In this example, the similarity function takes two strings s1 and s2 as input and returns a score between 0 and 1 indicating how similar the two strings are. The function first checks which string is longer and assigns it to longer and the other to shorter. It then calculates the edit distance between the two strings using the editDistance function and returns the similarity score.

The editDistance function calculates the edit distance between two strings using the Levenshtein distance algorithm. The function first converts the strings to lowercase and then initializes an array costs to store the costs of the operations. It then iterates over the characters of the strings and calculates the minimum cost of the operations required to transform one string into the other.

The main code then uses the similarity function to calculate the similarity scores between the user query and the Pinecone DB response and the ChatGPT Turbo 3.5 response. It then compares the scores and logs which response is closer to the user query.

 */

export function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }
  
export   function editDistance(s1, s2) {
    // s1 = s1.toLowerCase();
    // s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }