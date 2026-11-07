// The accessible answer is written once; speech changes only classes on visual tokens.
export function sentenceRanges(text) {
  return [...text.matchAll(/[^.!?]+[.!?]+|[^.!?]+$/g)].map(match => {
    const leading = match[0].length - match[0].trimStart().length;
    return { text: match[0].trim(), start: match.index + leading };
  });
}

export class AnswerView {
  constructor({ visual, accessible }) {
    this.visual = visual; this.accessible = accessible; this.text = null; this.words = [];
  }
  set(text) {
    this.clear();
    if (text === this.text) return;
    this.text = text;
    this.ranges = sentenceRanges(text);
    this.accessible.textContent = text;
    this.visual.replaceChildren(); this.words = [];
    const document = this.visual.ownerDocument;
    for (const match of text.matchAll(/\S+|\s+/g)) {
      if (/^\s+$/.test(match[0])) this.visual.append(document.createTextNode(match[0]));
      else {
        const element = document.createElement('span'); element.textContent = match[0];
        this.words.push({ element, start: match.index, end: match.index + match[0].length });
        this.visual.append(element);
      }
    }
  }
  clear() { for (const { element } of this.words) element.className = ''; }
  sentence(index) {
    this.clear(); this.index = index;
    const start = this.ranges[index]?.start ?? 0;
    const end = this.ranges[index + 1]?.start ?? this.text.length;
    for (const word of this.words) word.element.classList.toggle('spoken-sentence', word.start >= start && word.start < end);
  }
  word(index, length = 1) {
    const start = (this.ranges[this.index]?.start ?? 0) + index;
    for (const word of this.words) word.element.classList.toggle('spoken-word', word.start < start + Math.max(1, length) && word.end > start);
  }
}
