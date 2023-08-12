import FuzzySet from "fuzzyset";

/* Extends window object to include debugMode */
declare global {
  interface Window {
    debugMode: boolean;
  }
}

/* Sanitizes an input guess string */
export const cleanGuess = (input: string): string => {
  let output = input.trim().toLowerCase();
  output = output.replace(/[^a-zA-Z0-9]/g, "");
  return output;
};

/* Compares guess string to answer and returns a score */
export const fuzzyCompare = (needle: string, haystack: string): number => {
  const guessCompare = FuzzySet();
  guessCompare.add(cleanGuess(needle));
  return guessCompare.get(cleanGuess(haystack))?.[0]?.[0] || 0;
};

/* Extracts mana cost into array to convert into icons */
export const extractManaCost = (input: string): Array<string> => {
  let cost: string[] = [];
  let costInput = input.replaceAll("{", "");
  costInput.split("}").forEach((costCurrent) => {
    const costItem = costCurrent.replace("/", "").toLowerCase();
    if (costItem.length > 0) {
      cost.push(costItem);
    }
  });

  return cost;
};

/* Debugger console */
export const debugMessage = (message: string): void => {
  if (window.debugMode) {
    console.log(message);
  }
};
