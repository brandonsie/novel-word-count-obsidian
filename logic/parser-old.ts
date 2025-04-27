import { MarkdownParseResult } from "./parser";

const cjkRegex =
		/\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul}|[0-9]+/gu;
const wordRegex = /\s+/g;

export function countMarkdownObsolete(content: string): MarkdownParseResult {
  content = removeNonCountedContent(content);

  return {
    charCount: content.length,
    nonWhitespaceCharCount: countNonWhitespaceCharacters(content),
    spaceDelimitedWordCount: content.split(wordRegex).length,
    cjkWordCount: (content.match(cjkRegex) || []).length,
    newlineCount: content.split('\n').length - 1,
  };
}

function countNonWhitespaceCharacters(content: string): number {
  return (content.replace(/\s+/g, "") || []).length;
}

function removeNonCountedContent(
  content: string
): string {
  let meaningfulContent = content;

  const hasComments =
    meaningfulContent.includes("%%") || meaningfulContent.includes("<!--");
  if (hasComments) {
    meaningfulContent = meaningfulContent.replace(
      /(?:%%[\s\S]+?%%|<!--[\s\S]+?-->)/gim,
      ""
    );
  }

  if (meaningfulContent.includes("```")) {
    meaningfulContent = meaningfulContent.replace(
      /(?:```[\s\S]+?```)/gim,
      ""
    );
  }

  return meaningfulContent;
}