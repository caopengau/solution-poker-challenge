const fs = require("fs").promises;

export const orderNumberBasedOnFrequencyAndDesc = (numbers: number[]) => {
  const frequencyMap = new Map();

  numbers.forEach((number) => {
    if (frequencyMap.has(number)) {
      frequencyMap.set(number, frequencyMap.get(number) + 1);
    } else {
      frequencyMap.set(number, 1);
    }
  });

  const orderedNumbers = Array.from(frequencyMap.entries())
    .sort((a, b) => {
      if (a[1] === b[1]) {
        return b[0] - a[0];
      }
      return b[1] - a[1];
    })
    .map((eachEntry) => eachEntry[0]);

  return orderedNumbers;
};

export const readFile = async (filePath: string) => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

export const splitFileContentByNewline = (fileContent: string) => {
  const hands = fileContent.split("\n");
  return hands;
};
