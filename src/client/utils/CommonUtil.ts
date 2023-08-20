import FuzzySet from "fuzzyset";
import replaceSpecialCharacters from "replace-special-characters";

/* Extends window object to include debugMode */
declare global {
  interface Window {
    debugMode: boolean;
  }
}

/* Sanitizes an input guess string */
export const cleanGuess = (input: string): string => replaceSpecialCharacters(input.trim().toLowerCase()).replace(/[^a-zA-Z0-9]/g, "");

/* Compares guess string to answer and returns a score */
export const fuzzyCompare = (needle: string, haystack: string): number => {
  const guessCompare = FuzzySet();
  guessCompare.add(cleanGuess(needle));
  return guessCompare.get(cleanGuess(haystack))?.[0]?.[0] || 0;
};

/* Compares guess string to answer and returns a score */
export const guessCardName = (guess: string, cardName: string, isLegend: boolean = false): boolean => {
  const guessScore = fuzzyCompare(guess, cardName);
  if (guessScore >= 0.9) {
    return true;
  }

  // Additional guess check for legends (comma)
  if (isLegend) {
    const legendBeforeCommaIndex = cardName.indexOf(",");
    if (legendBeforeCommaIndex > 1) {
      const guessLegendCommaScore = fuzzyCompare(guess, cardName.substring(0, legendBeforeCommaIndex));
      if (guessLegendCommaScore >= 0.9) {
        return true;
      }
    }

    // Additional guess check for legends (space)
    const legendBeforeSpaceIndex = cardName.indexOf(" ");
    if (legendBeforeSpaceIndex > 1) {
      const guessLegendSpaceScore = fuzzyCompare(guess, cardName.substring(0, legendBeforeSpaceIndex));
      if (guessLegendSpaceScore >= 0.9) {
        return true;
      }
    }
  }

  return false;
};

/* Extracts mana cost into array to convert into icons */
export const extractManaCost = (input: string): Array<string> => {
  let cost: string[] = [];
  const costInput = input.replaceAll("{", "");
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

/* Deep copy */
export function deepCopy<T>(input: T): T {
  return JSON.parse(JSON.stringify(input)) as T;
}
