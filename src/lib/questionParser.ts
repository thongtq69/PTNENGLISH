/**
 * IELTS Reading Question Parser
 * Supports all 14 question types via inline tags in content HTML.
 *
 * Tag formats:
 *   [Q1]              → Fill-in-the-blank (types 9,11,12,13,14)
 *   [MC1:A,B,C,D]     → Multiple Choice single answer (type 1)
 *   [MCM1:A,B,C,D,E/2]→ Multiple Choice multi-answer, pick 2 (type 2)
 *   [TFNG1]           → True / False / Not Given (type 3)
 *   [YNNG1]           → Yes / No / Not Given (type 4)
 *   [MH1:i,ii,iii,iv] → Matching Headings dropdown (type 5)
 *   [MI1:A,B,C,D,E]   → Matching Information dropdown (type 6)
 *   [MF1:A,B,C,D]     → Matching Features dropdown (type 7)
 *   [MSE1:A,B,C,D,E,F]→ Matching Sentence Endings dropdown (type 8)
 *   [SC1:word1,word2,word3] → Summary Completion with word list (type 10)
 */

export type QuestionType =
  | "fill"       // [Q1]
  | "mc"         // [MC1:A,B,C,D]
  | "mcm"        // [MCM1:A,B,C,D,E/2]
  | "tfng"       // [TFNG1]
  | "ynng"       // [YNNG1]
  | "mh"         // [MH1:...]
  | "mi"         // [MI1:...]
  | "mf"         // [MF1:...]
  | "mse"        // [MSE1:...]
  | "sc";        // [SC1:...]

export interface ParsedQuestion {
  type: QuestionType;
  qIdx: number;
  options?: string[];    // choices for MC, dropdown, word-list
  maxSelect?: number;    // for MCM – how many to pick
  raw: string;           // original tag string e.g. "[MC1:A,B,C,D]"
}

export interface ContentPart {
  kind: "html" | "question";
  html?: string;
  question?: ParsedQuestion;
}

/**
 * Master regex that captures ALL question tag variants.
 * Order matters: longer prefixes first so MCM matches before MC.
 */
const TAG_REGEX = /\[(MCM|MC|TFNG|YNNG|MH|MI|MF|MSE|SC|Q)(\d+)(?::([^\]]*))?\]/g;

/**
 * Parse a single tag string into a ParsedQuestion.
 */
export function parseTag(raw: string): ParsedQuestion | null {
  const m = raw.match(/^\[(MCM|MC|TFNG|YNNG|MH|MI|MF|MSE|SC|Q)(\d+)(?::([^\]]*))?\]$/);
  if (!m) return null;

  const prefix = m[1];
  const qIdx = parseInt(m[2], 10);
  const payload = m[3] || "";

  const typeMap: Record<string, QuestionType> = {
    Q: "fill",
    MC: "mc",
    MCM: "mcm",
    TFNG: "tfng",
    YNNG: "ynng",
    MH: "mh",
    MI: "mi",
    MF: "mf",
    MSE: "mse",
    SC: "sc",
  };

  const type = typeMap[prefix] || "fill";

  let options: string[] | undefined;
  let maxSelect: number | undefined;

  if (type === "mcm") {
    // payload = "A,B,C,D,E/2"
    const slashIdx = payload.lastIndexOf("/");
    if (slashIdx !== -1) {
      options = payload.slice(0, slashIdx).split(",").map((s) => s.trim());
      maxSelect = parseInt(payload.slice(slashIdx + 1), 10) || 2;
    } else {
      options = payload.split(",").map((s) => s.trim());
      maxSelect = 2;
    }
  } else if (["mc", "mh", "mi", "mf", "mse", "sc"].includes(type) && payload) {
    options = payload.split(",").map((s) => s.trim());
  }

  return { type, qIdx, options, maxSelect, raw };
}

/**
 * Split content HTML into an ordered array of ContentParts.
 * Each part is either an HTML fragment or a parsed question.
 */
export function parseContent(content: string): ContentPart[] {
  if (!content) return [];

  const parts: ContentPart[] = [];
  let lastIndex = 0;

  // Reset regex state
  TAG_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TAG_REGEX.exec(content)) !== null) {
    // HTML before this tag
    if (match.index > lastIndex) {
      parts.push({ kind: "html", html: content.slice(lastIndex, match.index) });
    }

    const question = parseTag(match[0]);
    if (question) {
      parts.push({ kind: "question", question });
    } else {
      // Fallback: treat as HTML if parse fails
      parts.push({ kind: "html", html: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining HTML after last tag
  if (lastIndex < content.length) {
    parts.push({ kind: "html", html: content.slice(lastIndex) });
  }

  return parts;
}

/**
 * Extract all question indices from content (useful for counting).
 */
export function extractQuestionIndices(content: string): number[] {
  if (!content) return [];
  const indices: number[] = [];
  TAG_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG_REGEX.exec(content)) !== null) {
    const parsed = parseTag(m[0]);
    if (parsed) indices.push(parsed.qIdx);
  }
  return indices;
}

/**
 * Generate a tag string for admin insertion.
 */
export function generateTag(
  type: QuestionType,
  qIdx: number,
  options?: string[],
  maxSelect?: number
): string {
  const prefixMap: Record<QuestionType, string> = {
    fill: "Q",
    mc: "MC",
    mcm: "MCM",
    tfng: "TFNG",
    ynng: "YNNG",
    mh: "MH",
    mi: "MI",
    mf: "MF",
    mse: "MSE",
    sc: "SC",
  };

  const prefix = prefixMap[type];

  if (type === "fill" || type === "tfng" || type === "ynng") {
    return `[${prefix}${qIdx}]`;
  }

  if (type === "mcm" && options) {
    return `[${prefix}${qIdx}:${options.join(",")}/${maxSelect || 2}]`;
  }

  if (options && options.length > 0) {
    return `[${prefix}${qIdx}:${options.join(",")}]`;
  }

  return `[${prefix}${qIdx}]`;
}
