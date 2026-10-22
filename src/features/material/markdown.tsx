import { useMemo } from "react";
import { Text, View, type ColorValue } from "react-native";

import { renderInline } from "@/features/material/inline";

// Block-level markdown for lesson copy — lexicon-web's markdown.tsx: paragraphs,
// the author's line breaks, headings and lists, and anything else as plain
// text. What an email or a post says is half in its shape — the blank line
// between a greeting and a body, the sign-off on its own line — so the shape
// is kept.

type MdNode =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "paragraph"; text: string };

const HEADING = /^(#{1,3})\s+(.*)$/;
/** The space after the marker is what keeps `**bold**` from reading as a bullet. */
const BULLET = /^\s*[-*+]\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;

function parseMarkdown(text: string): MdNode[] {
  const nodes: MdNode[] = [];
  const lines = text.split("\n");
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) nodes.push({ kind: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]!;

    if (line.trim() === "") {
      flush();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      flush();
      nodes.push({ kind: "heading", level: heading[1]!.length as 1 | 2 | 3, text: heading[2]! });
      continue;
    }

    const ordered = ORDERED.test(line);
    if (ordered || BULLET.test(line)) {
      flush();
      // The whole run of same-kind items as one list.
      const marker = ordered ? ORDERED : BULLET;
      const items: string[] = [];
      let j = i;
      for (; j < lines.length; j += 1) {
        const item = marker.exec(lines[j]!);
        if (!item) break;
        items.push(item[1]!);
      }
      nodes.push({ kind: "list", ordered, items });
      i = j - 1;
      continue;
    }

    paragraph.push(line);
  }

  flush();
  return nodes;
}

/** Relative to the passage, as on the web: 1.3, 1.15 and 1.05 times it. */
const HEADING_SCALE = { 1: 1.3, 2: 1.15, 3: 1.05 } as const;

type Props = {
  text: string;
  /** The passage's colour: a themed card's, not the app's. */
  color: ColorValue;
  /** The passage's size. */
  size?: number;
  /** A face of its own — a passage set in mono. A Text's font doesn't reach
   *  into the Texts inside a View, so it is passed to each. */
  fontFamily?: string;
};

/** Lesson copy as markdown, in a card's own colour. */
export function Markdown({ text, color, size = 17, fontFamily }: Props) {
  const nodes = useMemo(() => parseMarkdown(text), [text]);
  const face = fontFamily ? { fontFamily } : undefined;
  const body = { color, fontSize: size, lineHeight: size * 1.6, ...face };

  return (
    <View className="gap-3">
      {nodes.map((node, index) => {
        if (node.kind === "heading") {
          const scaled = size * HEADING_SCALE[node.level];
          return (
            <Text
              key={index}
              style={{ color, fontSize: scaled, lineHeight: scaled * 1.35, ...face }}
              className={`font-sans ${node.level === 3 ? "font-semibold" : "font-bold"}`}
            >
              {renderInline(node.text)}
            </Text>
          );
        }

        if (node.kind === "list") {
          return (
            <View key={index} className="gap-1 pl-1">
              {node.items.map((item, position) => (
                <View key={position} className="flex-row gap-2">
                  <Text style={body} className="w-5 font-sans">
                    {node.ordered ? `${position + 1}.` : "•"}
                  </Text>
                  <Text style={body} className="flex-1 font-sans">
                    {renderInline(item)}
                  </Text>
                </View>
              ))}
            </View>
          );
        }

        return (
          <Text key={index} style={body} className="font-sans">
            {renderInline(node.text)}
          </Text>
        );
      })}
    </View>
  );
}
