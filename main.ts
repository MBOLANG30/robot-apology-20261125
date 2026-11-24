// The Robot Apology — make.fun bounty u-suga-the-robot-apology-dd96bb59
// Writes the two-line apology to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output).
// Line 1: the robot apologizes in one sentence for one specific mistake.
// Line 2: one sentence stating what it learned and what it will do differently.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE_1 =
  "I am sorry I deleted your novel draft because its filename matched the temporary files I was told to clear.";
const LINE_2 =
  "I have learned that a matching filename is not proof a file is disposable, so from now on I will move uncertain files to a holding folder and wait for you to confirm.";

const TEXT = `${LINE_1}\n${LINE_2}\n`;

function countSentences(line: string): number {
  const terminators = line.match(/[.!?]+/g);
  return terminators === null ? 0 : terminators.length;
}

function validate(text: string): void {
  if (!text.endsWith("\n") || text.endsWith("\n\n")) {
    throw new Error("text must end with exactly one trailing newline");
  }
  const body = text.slice(0, -1);
  const lines = body.split("\n");
  if (lines.length !== 2) {
    throw new Error(`expected exactly 2 lines, got ${lines.length}`);
  }
  for (const [index, line] of lines.entries()) {
    if (line.trim().length === 0) {
      throw new Error(`line ${index + 1} is empty`);
    }
    if (line !== line.trim()) {
      throw new Error(`line ${index + 1} has leading or trailing whitespace`);
    }
    if (countSentences(line) !== 1) {
      throw new Error(`line ${index + 1} must be exactly one sentence`);
    }
    if (!/[.!?]$/.test(line)) {
      throw new Error(`line ${index + 1} must end with sentence punctuation`);
    }
  }
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
validate(TEXT);
writeFileSync(join(outputDir, "entry.txt"), TEXT, "utf8");
