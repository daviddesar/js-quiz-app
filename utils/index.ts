import flow from 'lodash/fp/flow';

export const searchText =
  (initText: string) =>
  (
    startText: string,
    endText: string,
    isInline = false
  ): string | undefined => {
    const isSimilar = startText === endText;
    const startIndex = initText.indexOf(startText);
    const endIndex = isSimilar
      ? initText.split(endText, 2).join(endText).length + endText.length
      : initText.indexOf(endText) + endText.length; // TODO: search endIndex basing on startIndex
    const result = initText.substring(startIndex, endIndex);
    return !isInline ? result : result.replace(/(?:\r|\n).*$/, '');
  };

export const getOptions = (text: string) => {
  const pattern = /^- [A-Z].*$/;
  return text.split(/\r?\n|\r|\n/g).filter((it) => pattern.test(it));
};

export const getAnswer = (text: string) => {
  const ANSWER_PLACEHOLDER = '#### Answer: ';
  return text[text.indexOf(ANSWER_PLACEHOLDER) + ANSWER_PLACEHOLDER.length];
};

export const getQuestionsFromRawString = (rawString: string) => {
  const splitQuestions = (text: string) => text.split('---');

  const trimQuestions = (quests: string[]) => quests.map((it) => it.trim());

  const filteredQuestions = (quests: string[]) =>
    quests.filter((it) => it.startsWith('######'));

  return flow(splitQuestions, trimQuestions, filteredQuestions)(rawString);
};

const getQuestionContent = (textQuestion: string) => {
  const startIndex = textQuestion.search(/\r?\n|\r|\n/g) + 1;
  const endIndex = textQuestion.indexOf('- A');
  return textQuestion.slice(startIndex, endIndex);
};

const getQuestiontitle = (textQuestion: string) => {
  const startIndex = textQuestion.indexOf('######') + '######'.length;
  const endIndex = textQuestion.search(/\r?\n|\r|\n/g);
  return textQuestion.slice(startIndex, endIndex + 1);
};

export const transformQuestion = (
  textQuestion: string,
  id: number
): Question => {
  const searchCurrentQuestion = searchText(textQuestion);
  const title = getQuestiontitle(textQuestion);
  const questionContent = getQuestionContent(textQuestion);
  const options = getOptions(textQuestion);
  const answer = getAnswer(textQuestion);
  const explain = searchCurrentQuestion('<details>', '</details>');
  return {
    id,
    title,
    questionContent,
    options,
    answer,
    explain,
  };
};

export const GITHUB_RAW_DATA_LINK =
  'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';

export type Question = {
  id: number;
  title: string | undefined;
  questionContent: string | undefined;
  options: string[];
  answer: string | undefined;
  explain: string | undefined;
};
