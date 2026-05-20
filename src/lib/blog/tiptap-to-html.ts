import sanitizeHtml from "sanitize-html";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  Link.configure({ openOnClick: false }),
];

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

export function tiptapJsonToHtml(body: Record<string, unknown>): string {
  try {
    const raw = generateHTML(body, extensions);
    return sanitizeHtml(raw, SANITIZE_OPTIONS);
  } catch {
    return "";
  }
}
