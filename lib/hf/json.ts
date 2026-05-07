// Shared JSON extractor for HuggingFace chatCompletion responses.
// Handles common Gemma malformations: trailing commas, unterminated strings,
// unbalanced braces/brackets near the tail of the response.

export function extractJson(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  const candidates = [trimmed];
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) candidates.push(match[0]);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try repaired version
    }
    try {
      return JSON.parse(repairJson(candidate));
    } catch {
      // continue
    }
  }
  throw new Error("could not parse JSON response");
}

function repairJson(input: string): string {
  let s = input.trim();
  s = s.replace(/,\s*([}\]])/g, "$1");

  let inString = false;
  let escape = false;
  const stack: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" && stack[stack.length - 1] === "{") stack.pop();
    else if (ch === "]" && stack[stack.length - 1] === "[") stack.pop();
  }
  if (inString) s += '"';
  s = s.replace(/,\s*$/, "");
  while (stack.length) {
    const open = stack.pop();
    s += open === "{" ? "}" : "]";
  }
  return s;
}
