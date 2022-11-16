export enum Language {
  ENGLISH = 'ENGLISH',
  GERMAN = 'GERMAN',
  HUNGARIAN = 'HUNGARIAN',
}

export function getLanguageCode(language: Language | string): string {
  switch (language) {
    case Language.HUNGARIAN:
      return 'HU';
    case Language.GERMAN:
      return 'GE';
    case Language.ENGLISH:
      return 'EN';
    default:
      throw new Error('Language not found!');
  }
}
