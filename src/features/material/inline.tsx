import { Fragment, type ReactNode } from "react";
import { Platform, Text } from "react-native";

// Inline markdown for lesson copy — lexicon-web's inline-md.tsx: **bold**,
// *italic*, `code`, ~~strike~~, not nestable. Returns pieces to put inside a
// <Text>, which keeps the author's line breaks by itself.
//
// Montserrat is embedded without an italic face, so *italic* may come out
// upright.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|~~[^~]+~~)/g;

const MONO = Platform.select({ ios: "Menlo", default: "monospace" });

export function renderInline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={i} className="font-bold">
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("~~") && part.endsWith("~~")) {
      return (
        <Text key={i} className="line-through opacity-70">
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <Text key={i} className="italic">
          {part.slice(1, -1)}
        </Text>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <Text key={i} style={{ fontFamily: MONO }} className="bg-muted text-[0.9em]">
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
