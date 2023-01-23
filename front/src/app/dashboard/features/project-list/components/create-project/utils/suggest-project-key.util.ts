const WORD_SEPARATORS = /[ -]/;

export function suggestProjectKeyFromName(projectName: string) {
  if (!projectName) return '';

  const trimmedProjectName = projectName.trim();
  const words = trimmedProjectName.split(WORD_SEPARATORS);
  const wordsNumber = words.length;

  if (wordsNumber === 1) {
    return projectName.toUpperCase().slice(0, 2);
  }

  const twoFirstLetters = words
    .filter((_, index) => index <= 1)
    .map((word) => word.slice(0, 1));

  return twoFirstLetters.join('').toUpperCase();
}
