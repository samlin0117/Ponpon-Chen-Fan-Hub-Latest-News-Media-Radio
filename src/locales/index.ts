import zh from './zh.json';
import en from './en.json';
import ja from './ja.json';

export const translations = {
  zh,
  en,
  ja
};

export type Language = keyof typeof translations;
